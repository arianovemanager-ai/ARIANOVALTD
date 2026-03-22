"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface FadeInViewProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
  amount?: number | "some" | "all";
}

export default function FadeInView({ 
  children, 
  delay = 0, 
  duration = 0.8, 
  direction = 'up',
  className = "",
  amount = 0.2
}: FadeInViewProps) {
  
  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { y: 40, opacity: 0 }
      case 'down': return { y: -40, opacity: 0 }
      case 'left': return { x: 40, opacity: 0 }
      case 'right': return { x: -40, opacity: 0 }
      case 'none': return { opacity: 0 }
      default: return { y: 40, opacity: 0 }
    }
  }

  return (
    <motion.div
      initial={getInitialPosition()}
      whileInView={{ x: 0, y: 0, opacity: 1 }}
      viewport={{ once: true, amount }} // Triggers once it crosses the view threshold
      transition={{ 
        duration, 
        delay, 
        ease: [0.21, 0.47, 0.32, 0.98] // Custom elegant bezier curve natively softening the snap
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
