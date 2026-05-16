import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/checkout/route';
import { client } from '@/sanity/lib/client';

// Mock Stripe to prevent top-level initialization errors in the route file
vi.mock('stripe', () => {
  return {
    default: class {
      checkout = {
        sessions: {
          create: vi.fn().mockResolvedValue({ url: 'http://mock-stripe.com' }),
        },
      }
    },
    Stripe: vi.fn(),
  };
});

// Mock Next.js Auth
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn().mockResolvedValue({ userId: 'test_user_123' }),
}));

// Mock Cin7 Live Stock to avoid hitting real APIs or failing env validation in tests
vi.mock('@/lib/cin7', () => ({
  getLiveCin7Stock: vi.fn().mockResolvedValue({ 'syrah-2021': 10 })
}));

// Mock Sanity Client
vi.mock('@/sanity/lib/client', () => {
  const mPatch = vi.fn();
  const mCommit = vi.fn();
  const mTransaction = vi.fn(() => ({
    patch: mPatch,
    commit: mCommit,
  }));
  
  const mWithConfig = vi.fn().mockReturnValue({
    fetch: vi.fn(),
    transaction: mTransaction,
  });

  return {
    client: {
      withConfig: mWithConfig,
    },
  };
});

describe('Checkout Route - Optimistic Locking (secureStockLock)', () => {
  const mockWriteClient = client.withConfig({ token: 'mock' });
  let mFetch: any;
  let mTransaction: any;
  let mPatch: any;
  let mCommit: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mFetch = mockWriteClient.fetch as ReturnType<typeof vi.fn>;
    mTransaction = mockWriteClient.transaction as ReturnType<typeof vi.fn>;
    
    // We need to re-grab the mocked methods from the transaction mock
    const txInstance = mTransaction();
    mPatch = txInstance.patch;
    mCommit = txInstance.commit;
    
    // reset transaction so it doesn't count the setup call
    mTransaction.mockClear(); 
  });

  it('Happy Path: Successfully acquires lock on first attempt', async () => {
    // 1. Mock DB state
    // Fetch 1: Get SKUs for live check
    mFetch.mockResolvedValueOnce([
      { _id: 'wine_1', sku: 'syrah-2021', title: 'Syrah' }
    ]);
    // Fetch 2: Get full details inside the retry loop
    mFetch.mockResolvedValueOnce([
      { _id: 'wine_1', _type: 'wine', physical_stock: 10, committed_stock: 2, price: 5000, title: 'Syrah', sku: 'syrah-2021', _rev: 'rev_1' }
    ]);
    mCommit.mockResolvedValueOnce({ success: true });

    const req = new Request('http://localhost/api/checkout', {
      method: 'POST',
      body: JSON.stringify({ items: [{ id: 'wine_1', quantity: 2, title: 'Syrah' }] })
    });

    // 2. Execute
    const response = await POST(req);
    
    // 3. Assert
    expect(mFetch).toHaveBeenCalledTimes(2); // 1 SKU fetch + 1 details fetch
    expect(mPatch).toHaveBeenCalledWith('wine_1', {
      ifRevisionID: 'rev_1',
      setIfMissing: { committed_stock: 0 },
      inc: { committed_stock: 2 }
    });
    expect(mCommit).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(200);
  });

  it('Optimistic Lock Failure: 409 Collision Recovery Loop', async () => {
    // Fetch 1: Get SKUs (called once outside retry loop)
    mFetch.mockResolvedValueOnce([
      { _id: 'wine_1', sku: 'syrah-2021', title: 'Syrah' }
    ]);

    // Attempt 1 Fetch inside loop
    mFetch.mockResolvedValueOnce([
      { _id: 'wine_1', _type: 'wine', physical_stock: 10, committed_stock: 2, price: 5000, title: 'Syrah', sku: 'syrah-2021', _rev: 'stale_rev' }
    ]);
    
    // Attempt 1 Commit Fails with 409
    const conflictError = new Error('Revision Mismatch');
    (conflictError as any).statusCode = 409;
    mCommit.mockRejectedValueOnce(conflictError);

    // Attempt 2 Fetch inside loop (New _rev)
    mFetch.mockResolvedValueOnce([
      { _id: 'wine_1', _type: 'wine', physical_stock: 10, committed_stock: 3, price: 5000, title: 'Syrah', sku: 'syrah-2021', _rev: 'fresh_rev' }
    ]);
    
    // Attempt 2 Commit Succeeds
    mCommit.mockResolvedValueOnce({ success: true });

    const req = new Request('http://localhost/api/checkout', {
      method: 'POST',
      body: JSON.stringify({ items: [{ id: 'wine_1', quantity: 1, title: 'Syrah' }] })
    });

    const response = await POST(req);

    // Assertions
    expect(mFetch).toHaveBeenCalledTimes(3); // 1 SKU fetch + 2 Loop fetches
    expect(mPatch).toHaveBeenCalledTimes(2);
    
    // Verify Attempt 2 used the new _rev
    expect(mPatch).toHaveBeenLastCalledWith('wine_1', {
      ifRevisionID: 'fresh_rev',
      setIfMissing: { committed_stock: 0 },
      inc: { committed_stock: 1 }
    });
    
    expect(mCommit).toHaveBeenCalledTimes(2);
    expect(response.status).toBe(200);
  });
});
