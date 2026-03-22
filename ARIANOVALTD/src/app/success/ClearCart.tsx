"use client"

import { useEffect, useRef } from "react"
import { useCart } from "@/context/CartContext"

export default function ClearCart() {
  const { clearCart, isHydrated } = useCart()
  const cleared = useRef(false)

  // Safely intercept Mount to natively wipe local cart memory arrays only AFTER initial hydration completes!
  useEffect(() => {
    if (isHydrated && !cleared.current) {
      clearCart()
      cleared.current = true
    }
  }, [clearCart, isHydrated])

  return null
}
