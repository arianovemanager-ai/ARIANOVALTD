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
      />
    </motion.div>
  )
}
