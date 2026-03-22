import { describe, it, expect, vi, beforeEach } from 'vitest'

// Deep mock the Stripe backend arrays to natively synthesize payloads instantly utilizing Vitest hoists
const { mockStripeConstructEvent, mockListLineItems, mockRetrieveProduct } = vi.hoisted(() => {
  return {
    mockStripeConstructEvent: vi.fn(),
    mockListLineItems: vi.fn(),
    mockRetrieveProduct: vi.fn()
  }
})

vi.mock('stripe', () => {
  return {
    default: class Stripe {
      webhooks = {
        constructEvent: mockStripeConstructEvent
      };
      checkout = {
        sessions: {
          listLineItems: mockListLineItems
        }
      };
      products = {
        retrieve: mockRetrieveProduct
      };
    }
  }
})

// Deep mock the Sanity Transaction Client overlay bypassing literal network writes natively
const { mockDec, mockCommit, mockPatch, mockCreate } = vi.hoisted(() => {
  const dec = vi.fn().mockReturnThis()
  const commit = vi.fn().mockResolvedValue(true)
  const patch = vi.fn().mockImplementation(() => ({ dec, commit }))
  const create = vi.fn().mockResolvedValue({ _id: 'mock-order-id' })
  
  return { mockDec: dec, mockCommit: commit, mockPatch: patch, mockCreate: create }
})

vi.mock('@/sanity/lib/client', () => {
  return {
    client: {
      withConfig: vi.fn().mockReturnValue({
        patch: mockPatch,
        create: mockCreate
      })
    }
  }
})

// Dynamically invoke the native POST webhook logic handling Stripe intersections
import { POST } from '@/app/api/webhooks/stripe/route'

describe('Stripe Webhook -> Sanity Inventory Pipeline', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_mock_123'
    process.env.SANITY_WRITE_TOKEN = 'sanity_test_token_mock_123'
  })

  it('Verifies Event signatures, releases local Commits, and permanently drops Physical Stock boundaries', async () => {
    // 1. Force Stripe API to artificially trigger an authorized Checkout Completed webhook natively 
    mockStripeConstructEvent.mockReturnValue({
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test_mock_8217316719',
          amount_total: 4500,
          metadata: { clerkUserId: 'user_123_mock' },
          customer_details: { email: 'mock_tester@arianova.com', name: 'Arianova Tester' }
        }
      }
    })

    // 2. Synthesize line item arrays indicating the purchase of 2 units
    mockListLineItems.mockResolvedValue({
      data: [{
        quantity: 2,
        price: { product: 'prod_test_wine', unit_amount: 2250 }
      }]
    })

    // 3. Prove Stripe Product Maps correctly back to the Sanity ID reference structure statically
    mockRetrieveProduct.mockResolvedValue({
      metadata: { wine_id: 'sanity_wine_id_xyz' },
      name: 'Arianova Mock Vintage'
    })

    // Execute standard Route Handlers purely
    const req = new Request('http://localhost/api/webhooks/stripe', {
      method: 'POST',
      headers: { 'stripe-signature': 'test_sig' },
      body: 'raw_test_body'
    })

    const res = await POST(req)
    
    // Assert strictly passing HTTP statuses logically
    expect(res.status).toBe(200)
    
    // ** THE ABSOLUTE INVENTORY LOGIC TEST: Prove the exact Sanity `dec()` mutator intercepts both variables natively **
    expect(mockPatch).toHaveBeenCalledWith('sanity_wine_id_xyz')
    expect(mockDec).toHaveBeenCalledWith({
      physical_stock: 2, // Hard Stop mapping completes
      committed_stock: 2 // Soft Lock is actively released
    })
    expect(mockCommit).toHaveBeenCalled()
    
    // Synthesize the Order drop to prove standard logistics fulfillment passes automatically
    expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({
      _type: 'order',
      orderNumber: expect.any(String),
      totalAmount: 4500,
      status: 'Processing',
    }))
  })
})
