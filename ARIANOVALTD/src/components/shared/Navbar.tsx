"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth, ClerkLoading, ClerkLoaded, UserButton } from "@clerk/nextjs"
import { useCart } from "@/context/CartContext"
import { ShoppingCart, Loader2, Menu, X, Wine, BookOpen, Briefcase, Calendar } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import Logo from "./Logo"

export default function Navbar() {
  const pathname = usePathname();
  const { userId } = useAuth();
  const { totalItems, isHydrated, openCart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (pathname && pathname.startsWith('/studio')) return null;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const navLinks = [
    { name: "Portfolio", href: "/", icon: Wine },
    { name: "Events", href: "/events", icon: Calendar },
    { name: "Partner Estates", href: "/vineyard", icon: Briefcase },
    { name: "The Story", href: "/story", icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-border bg-brand-bg/95 backdrop-blur-md shadow-2xl">
      <div className="container mx-auto px-6 h-24 flex items-center justify-between">
        {/* Brand Logo & Mark */}
        <Link href="/" onClick={closeMenu} className="flex items-center gap-4 group relative z-[60]">
          <Logo className="w-10 h-10 text-brand-accent transition-transform duration-500 group-hover:rotate-12" />
          <div className="flex flex-col">
            <span className="font-serif text-xl tracking-[0.3em] text-brand-foreground leading-none">ARIANOVA</span>
            <span className="text-[7px] tracking-[0.4em] text-brand-accent/60 uppercase mt-1.5 font-bold">Italian Food & Wine</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex gap-6 xl:gap-10 text-xs font-semibold uppercase tracking-widest text-brand-foreground/80 whitespace-nowrap">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-white transition-colors">
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Actions & Hamburger */}
        <div className="flex items-center gap-4 lg:gap-6 relative z-[60]">
          <button onClick={openCart} className="relative text-brand-foreground/80 hover:text-white transition-colors focus:outline-none">
            <ShoppingCart className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />
            {isHydrated && totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-brand-accent text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm">
                {totalItems}
              </span>
            )}
          </button>

          {/* Elegant Loading State for Auth */}
          <ClerkLoading>
            <div className="w-9 h-9 flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-brand-foreground/40 animate-spin" />
            </div>
          </ClerkLoading>

          <ClerkLoaded>
            <div className="hidden lg:flex items-center gap-6 whitespace-nowrap">
              {!userId ? (
                <>
                  <Link href="/sign-in" className="text-xs font-semibold uppercase tracking-widest text-brand-foreground/80 hover:text-white transition-colors">
                    Sign In
                  </Link>
                  <Link href="/sign-up" className="inline-flex items-center justify-center px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-brand-foreground bg-brand-bg hover:bg-brand-surface transition-colors rounded-sm shadow-sm">
                    Join the Curation
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/cellar" className="text-xs font-semibold uppercase tracking-widest text-brand-foreground/80 hover:text-white transition-colors">
                    My Cellar
                  </Link>
                  <Link href="/profile" className="text-xs font-semibold uppercase tracking-widest text-brand-foreground/80 hover:text-white transition-colors">
                    Dossier
                  </Link>
                  <UserButton appearance={{ elements: { avatarBox: "w-9 h-9 border border-brand-border/20" } }} />
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={toggleMenu} 
              className="lg:hidden text-brand-foreground p-2 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </ClerkLoaded>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 top-0 z-50 bg-brand-surface lg:hidden overflow-hidden flex flex-col pt-32 px-10 pb-10"
          >
            <nav className="flex flex-col gap-8 mb-12">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + idx * 0.1 }}
                >
                  <Link 
                    href={link.href} 
                    onClick={closeMenu}
                    className="flex items-center gap-4 text-2xl font-serif text-brand-foreground hover:text-brand-accent transition-colors"
                  >
                    <link.icon className="w-6 h-6 text-brand-accent/60" strokeWidth={1.5} />
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="h-px w-full bg-brand-bg/10 mb-12" />

            <div className="flex flex-col gap-6">
              {!userId ? (
                <>
                  <Link 
                    href="/sign-in" 
                    onClick={closeMenu}
                    className="text-lg font-serif text-brand-foreground/80 hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/sign-up" 
                    onClick={closeMenu}
                    className="inline-flex items-center justify-center px-8 py-4 text-sm font-semibold uppercase tracking-widest text-brand-foreground bg-brand-bg rounded-sm shadow-lg w-full"
                  >
                    Join the Curation
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    href="/cellar" 
                    onClick={closeMenu}
                    className="text-lg font-serif text-brand-foreground/80 hover:text-white transition-colors"
                  >
                    My Cellar
                  </Link>
                  <Link 
                    href="/profile" 
                    onClick={closeMenu}
                    className="text-lg font-serif text-brand-foreground/80 hover:text-white transition-colors"
                  >
                    Dossier
                  </Link>
                  <div className="flex items-center gap-4 pt-4 border-t border-brand-border/10">
                    <UserButton appearance={{ elements: { avatarBox: "w-12 h-12" } }} />
                    <span className="text-sm font-semibold uppercase tracking-widest text-brand-foreground/60">Account Settings</span>
                  </div>
                </>
              )}
            </div>
            
            <div className="mt-auto text-center opacity-30">
              <p className="font-serif text-brand-foreground tracking-widest text-xs uppercase">Est. 2024</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
