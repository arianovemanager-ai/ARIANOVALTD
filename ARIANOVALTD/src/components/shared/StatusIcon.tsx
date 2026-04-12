"use client"
import { motion } from "framer-motion"
import { Clock, PackageCheck, Package } from "lucide-react"

export default function StatusIcon({ status, id }: { status: string, id?: string }) {
  if (status === 'Processing') {
    return (
      <motion.div
        layout
        {...(id ? { layoutId: `status-icon-processing-${id}` } : {})}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <Clock className="w-4 h-4 text-amber-600" />
      </motion.div>
    )
  }
  if (status === 'Shipped') {
    return <PackageCheck className="w-4 h-4 text-green-700" />
  }
  return <Package className="w-4 h-4 text-brand-foreground/60" />
}
