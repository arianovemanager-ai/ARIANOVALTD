"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { usePathname } from "next/navigation"

export default function Footer() {
  const pathname = usePathname();
  if (pathname && pathname.startsWith('/studio')) return null;

  return (
    <footer className="bg-[#4A0404] text-[#F9F6EE] py-24 px-6 border-t border-[#F9F6EE]/10">
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
            <p className="text-[#F9F6EE]/60 text-lg font-light max-w-md">
              Some drink to celebrate. Some to pair. Some to remember. That’s where we come in.
            </p>
          </motion.div>
          
          <div className="flex flex-col md:items-end gap-8">
             <Link 
              href="/" 
              className="text-4xl md:text-6xl font-serif tracking-[0.2em] hover:text-[#B8860B] transition-colors"
            >
              ARIANOVA
            </Link>
            <div className="flex gap-8 text-[10px] uppercase tracking-[0.3em] font-bold text-[#F9F6EE]/40">
              <Link href="/" className="hover:text-[#F9F6EE] transition-colors">Portfolio</Link>
              <Link href="/vineyard" className="hover:text-[#F9F6EE] transition-colors">Estates</Link>
              <Link href="/story" className="hover:text-[#F9F6EE] transition-colors">Story</Link>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-[#F9F6EE]/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#F9F6EE]/30">
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
