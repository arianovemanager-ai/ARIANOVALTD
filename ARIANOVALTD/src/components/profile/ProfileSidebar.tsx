"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Wine, User, ShieldCheck, LogOut } from "lucide-react"
import { useClerk } from "@clerk/nextjs"

export default function ProfileSidebar() {
  const pathname = usePathname()
  const { signOut } = useClerk()

  const links = [
    { name: "Dossier", href: "/profile", icon: User },
    { name: "My Cellar", href: "/cellar", icon: Wine },
  ]

  return (
    <div className="w-full md:w-64 flex-shrink-0 flex flex-col gap-2">
      <h2 className="font-serif text-2xl text-[#4A0404] mb-6 px-4">Navigation</h2>
      <nav className="flex flex-col gap-1">
        {links.map((link) => {
          const isActive = pathname === link.href
          const Icon = link.icon
          return (
            <Link 
              key={link.name} 
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-sm text-sm uppercase tracking-widest font-semibold transition-all ${
                isActive 
                  ? 'bg-[#4A0404] text-[#F9F6EE] shadow-sm' 
                  : 'text-[#4A0404]/70 hover:bg-[#4A0404]/5 hover:text-[#4A0404]'
              }`}
            >
              <Icon className="w-4 h-4" />
              {link.name}
            </Link>
          )
        })}
        
        <button 
          onClick={() => signOut({ redirectUrl: '/' })}
          className="flex flex-row items-center justify-start gap-3 px-4 py-3 rounded-sm text-sm uppercase tracking-widest font-semibold text-[#4A0404]/50 hover:bg-black/5 hover:text-red-700 transition-all mt-4"
        >
          <LogOut className="w-4 h-4" />
          Disconnect
        </button>
      </nav>
    </div>
  )
}
