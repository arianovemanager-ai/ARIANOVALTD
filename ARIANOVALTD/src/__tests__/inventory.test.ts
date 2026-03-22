import { describe, it, expect } from 'vitest'
import { getAvailableStock } from '@/lib/inventory'

describe('Inventory Boundaries & Allocation Logic', () => {
  it('Mathematically deducts active commits from warehouse physicals', () => {
    expect(getAvailableStock(10, 2)).toBe(8)
    expect(getAvailableStock(100, 45)).toBe(55)
  })

  it('Correctly enforces 0 bounds when precisely fully committed', () => {
    expect(getAvailableStock(5, 5)).toBe(0)
  })

  it('NEVER natively returns a negative number even if committed arrays overflow physical bounds (Hard Stop bypass)', () => {
    expect(getAvailableStock(2, 5)).toBe(0) // Absolute mathematical safety barrier
    expect(getAvailableStock(0, 1)).toBe(0)
  })

  it('Defaults to graceful zero-state parsing when injected with undefined schemas', () => {
    expect(getAvailableStock(undefined, undefined)).toBe(0)
    expect(getAvailableStock(5, null as any)).toBe(5)
  })
})
