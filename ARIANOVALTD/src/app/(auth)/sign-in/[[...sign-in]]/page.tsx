"use client"

import { SignIn } from "@clerk/nextjs"
import { motion } from "framer-motion"

export default function SignInPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} // Elegant spring curve mapped
      className="flex justify-center"
    >
      <SignIn 
        path="/sign-in" 
        routing="path" 
        signUpUrl="/sign-up"
        appearance={{
          layout: {
            logoPlacement: "none", // Eradicate default application logo overrides completely
          },
          elements: {
            rootBox: "w-full max-w-md",
            card: "bg-brand-surface/75 backdrop-blur-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.6)] border-none rounded-none w-full p-2 sm:p-6",
            headerTitle: "font-serif text-[28px] text-brand-foreground tracking-widest uppercase text-center mb-1",
            headerSubtitle: "text-brand-foreground/80 text-xs font-sans font-medium text-center uppercase tracking-widest",
            formButtonPrimary: "bg-brand-surface hover:bg-brand-accent/80 text-[#F5F5DC] tracking-[0.2em] uppercase text-xs font-bold py-4 mt-6 rounded-none shadow-xl transition-all",
            socialButtonsBlockButton: "border border-brand-border/20 hover:bg-brand-surface/10 text-brand-foreground rounded-none bg-transparent backdrop-blur-sm py-3",
            socialButtonsBlockButtonText: "font-sans font-semibold tracking-wide text-xs uppercase",
            formFieldLabel: "text-brand-foreground font-sans font-bold uppercase tracking-widest text-[10px] mb-2 opacity-90",
            formFieldInput: "bg-brand-surface/40 border-b border-brand-border/30 border-t-0 border-l-0 border-r-0 focus:border-brand-border focus:ring-0 rounded-none py-3 font-sans text-brand-foreground transition-all",
            footerActionLink: "text-brand-foreground hover:text-[#3A0303] font-bold font-sans uppercase tracking-[0.1em] text-[11px]",
            footerActionText: "text-brand-foreground/70 font-sans text-[10px] uppercase tracking-widest",
            dividerLine: "bg-brand-surface/20",
            dividerText: "text-brand-foreground/80 text-[10px] font-sans font-bold uppercase tracking-widest",
            identityPreviewText: "font-sans font-semibold tracking-widest text-brand-foreground",
            identityPreviewEditButtonIcon: "text-brand-foreground",
            formResendCodeLink: "text-brand-foreground font-bold uppercase tracking-widest text-[10px]",
          }
        }}
      />
    </motion.div>
  )
}
