"use client"

import { SignUp } from "@clerk/nextjs"
import { motion } from "framer-motion"

export default function SignUpPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} 
      className="flex justify-center"
    >
      <SignUp 
        path="/sign-up" 
        routing="path" 
        signInUrl="/sign-in"
        appearance={{
          layout: {
            logoPlacement: "none",
          },
          elements: {
            rootBox: "w-full max-w-md",
            card: "bg-[#F5F5DC]/75 backdrop-blur-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.6)] border-none rounded-none w-full p-2 sm:p-6",
            headerTitle: "font-serif text-[28px] text-[#4A0404] tracking-widest uppercase text-center mb-1",
            headerSubtitle: "text-[#4A0404]/80 text-xs font-sans font-medium text-center uppercase tracking-widest",
            formButtonPrimary: "bg-[#4A0404] hover:bg-[#3A0303] text-[#F5F5DC] tracking-[0.2em] uppercase text-xs font-bold py-4 mt-6 rounded-none shadow-xl transition-all",
            socialButtonsBlockButton: "border border-[#4A0404]/20 hover:bg-[#4A0404]/10 text-[#4A0404] rounded-none bg-transparent backdrop-blur-sm py-3",
            socialButtonsBlockButtonText: "font-sans font-semibold tracking-wide text-xs uppercase",
            formFieldLabel: "text-[#4A0404] font-sans font-bold uppercase tracking-widest text-[10px] mb-2 opacity-90",
            formFieldInput: "bg-[#F5F5DC]/40 border-b border-[#4A0404]/30 border-t-0 border-l-0 border-r-0 focus:border-[#4A0404] focus:ring-0 rounded-none py-3 font-sans text-[#4A0404] transition-all",
            footerActionLink: "text-[#4A0404] hover:text-[#3A0303] font-bold font-sans uppercase tracking-[0.1em] text-[11px]",
            footerActionText: "text-[#4A0404]/70 font-sans text-[10px] uppercase tracking-widest",
            dividerLine: "bg-[#4A0404]/20",
            dividerText: "text-[#4A0404]/80 text-[10px] font-sans font-bold uppercase tracking-widest",
          }
        }}
      />
    </motion.div>
  )
}
