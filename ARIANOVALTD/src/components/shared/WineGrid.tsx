"use client"

import { motion, Variants } from "framer-motion"
import WineCard from "./WineCard"

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
}

interface WineGridProps {
  wines: any[];
}

export default function WineGrid({ wines }: WineGridProps) {
  if (wines.length === 0) {
    return (
      <div className="flex flex-col items-center text-center py-20 w-full">
        <p className="text-brand-foreground/60 italic font-serif text-lg">
          Our cellar is currently being restocked. Please check back shortly.
        </p>
      </div>
    )
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-16 lg:gap-x-12 w-full"
    >
      {wines.map((wine) => (
        <motion.div key={wine._id} variants={itemVariants}>
          <WineCard wine={wine} />
        </motion.div>
      ))}
    </motion.div>
  )
}
