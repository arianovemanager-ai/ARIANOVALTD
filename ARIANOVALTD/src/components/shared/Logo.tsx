"use client"

import { motion } from "framer-motion"

interface LogoProps {
  className?: string
  color?: string
}

export default function Logo({ className = "w-12 h-12", color = "currentColor" }: LogoProps) {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* High-Fidelity Replica with Continuous Left-to-Right Flow */}
      <motion.path
        d="M40 80V20"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="butt"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
      />
      <motion.path
        d="M40 20L70 80"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="butt"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.43, 0.13, 0.23, 0.96] }}
      />
      <motion.path
        d="M70 78C60 60 52 35 80 15"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
      />
    </motion.svg>
  )
}
