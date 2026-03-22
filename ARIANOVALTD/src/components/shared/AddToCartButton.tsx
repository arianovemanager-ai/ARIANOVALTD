"use client"

import { useCart } from "@/context/CartContext"
import { toast } from "sonner"
import { motion } from "framer-motion"

interface AddToCartButtonProps {
  wine: {
    _id: string
    title: string
    price: number
    imageUrl: string | null
  }
  available: number
}

export default function AddToCartButton({ wine, available }: AddToCartButtonProps) {
  const { addToCart } = useCart()
  const isSoldOut = available <= 0

  const handleAdd = () => {
    addToCart({
      id: wine._id,
      title: wine.title,
      price: wine.price,
      imageUrl: wine.imageUrl,
    })
    
    // Premium Toast Hook
    toast.success('Vintage Secured', {
      description: `${wine.title} has been added to your curated selection.`,
      duration: 3500,
    })
  }

  return (
    <div className="w-full md:w-auto relative">
      <motion.button 
        whileTap={!isSoldOut ? { scale: 0.98 } : {}}
        disabled={isSoldOut}
        onClick={handleAdd}
        className={`px-10 py-5 tracking-[0.2em] text-xs font-bold uppercase rounded-sm w-full shadow-md
          ${isSoldOut 
            ? 'bg-[#EAE6D9] text-[#4A0404]/40 cursor-not-allowed' 
            : 'transition-colors bg-[#4A0404] text-[#F9F6EE] hover:bg-[#3A0303] hover:shadow-lg'}`}
      >
        {isSoldOut ? "Sold Out" : "Acquire the Vintage"}
      </motion.button>
    </div>
  )
}
