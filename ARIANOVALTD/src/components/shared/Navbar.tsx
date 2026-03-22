"use client"

import Link from "next/link"
import { SignInButton, SignUpButton, UserButton, useAuth, ClerkLoading, ClerkLoaded } from "@clerk/nextjs"
import { useCart } from "@/context/CartContext"
import { ShoppingCart, Loader2 } from "lucide-react"

export default function Navbar() {
  const { userId } = useAuth();
  const { totalItems, isHydrated, openCart } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#4A0404] bg-[#4A0404] shadow-md">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="font-serif text-2xl tracking-[0.2em] text-[#F9F6EE]">
          ARIANOVA
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex gap-10 text-xs font-semibold uppercase tracking-widest text-[#F9F6EE]/80">
          <Link href="/" className="hover:text-white transition-colors">Portfolio</Link>
          <Link href="/vineyard" className="hover:text-white transition-colors">Partner Estates</Link>
          <Link href="/story" className="hover:text-white transition-colors">Distribution Model</Link>
        </nav>

        {/* Authentication Actions & Cart */}
        <div className="flex items-center gap-6">
          <button onClick={openCart} className="relative text-[#F9F6EE]/80 hover:text-white transition-colors focus:outline-none">
            <ShoppingCart className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />
            {isHydrated && totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#B8860B] text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm">
                {totalItems}
              </span>
            )}
          </button>

          {/* Elegant Loading State for Auth */}
          <ClerkLoading>
            <div className="w-9 h-9 flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-[#F9F6EE]/40 animate-spin" />
            </div>
          </ClerkLoading>

          <ClerkLoaded>
            {!userId ? (
              <>
                <Link href="/sign-in" className="text-xs font-semibold uppercase tracking-widest text-[#F9F6EE]/80 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link href="/sign-up" className="hidden sm:inline-flex items-center justify-center px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-[#4A0404] bg-[#F9F6EE] hover:bg-[#EAE6D9] transition-colors rounded-sm shadow-sm">
                  Trade Account
                </Link>
              </>
            ) : (
              <>
                <Link href="/cellar" className="text-xs font-semibold uppercase tracking-widest text-[#F9F6EE]/80 hover:text-white transition-colors hidden sm:block">
                  My Cellar
                </Link>
                <Link href="/profile" className="text-xs font-semibold uppercase tracking-widest text-[#F9F6EE]/80 hover:text-white transition-colors hidden sm:block">
                  Dossier
                </Link>
                <UserButton appearance={{ elements: { avatarBox: "w-9 h-9 border border-[#F9F6EE]/20" } }} />
              </>
            )}
          </ClerkLoaded>
        </div>
      </div>
    </header>
  )
}
