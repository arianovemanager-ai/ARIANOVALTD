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
      />
    </motion.div>
  )
}
