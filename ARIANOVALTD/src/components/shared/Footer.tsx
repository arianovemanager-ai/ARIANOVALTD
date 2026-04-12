"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { usePathname } from "next/navigation"

import Logo from "./Logo"

export default function Footer() {
  const pathname = usePathname();
  if (pathname && pathname.startsWith('/studio')) return null;

  return (
    <footer className="bg-brand-bg text-brand-foreground py-24 px-6 border-t border-brand-border">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            className="flex flex-col gap-6"
          >
            <h3 className="font-serif text-3xl md:text-4xl leading-tight">
              Wine is never one thing — and neither are you.
            </h3>
            <p className="text-brand-foreground/60 text-lg font-light max-w-md">
              Some drink to celebrate. Some to pair. Some to remember. That’s where we come in.
            </p>
          </motion.div>
          
             <div className="flex flex-col md:items-end gap-6 text-right">
              <Link 
                href="/" 
                className="group flex flex-col md:items-end"
              >
                <Logo className="w-12 h-12 text-brand-accent mb-4 transition-transform group-hover:scale-110" />
                <span className="text-3xl md:text-5xl font-serif tracking-[0.2em] text-brand-foreground group-hover:text-brand-accent transition-colors">
                  ARIANOVA
                </span>
                <span className="text-[10px] tracking-[0.5em] text-brand-accent/40 uppercase mt-3 font-bold">Italian Food & Wine</span>
              </Link>
            <div className="flex gap-8 text-[10px] uppercase tracking-[0.3em] font-bold text-brand-foreground/40">
              <Link href="/" className="hover:text-brand-foreground transition-colors">Portfolio</Link>
              <Link href="/vineyard" className="hover:text-brand-foreground transition-colors">Estates</Link>
              <Link href="/story" className="hover:text-brand-foreground transition-colors">Story</Link>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-brand-border/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-foreground/30">
          <p>© {new Date().getFullYear()} ARIANOVA. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
            <span className="cursor-default">BOTTLED ITALY</span>
            <span className="cursor-default">DESIGNED WITH LOVE</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
