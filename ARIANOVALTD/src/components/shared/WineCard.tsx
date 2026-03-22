"use client"

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface WineCardProps {
  wine: {
    _id: string;
    title: string;
    slug: string;
    price: number;
    vintage: number | null;
    imageUrl: string | null;
    physical_stock: number;
    committed_stock: number;
  };
}

export default function WineCard({ wine }: WineCardProps) {
  const available = (wine.physical_stock || 0) - (wine.committed_stock || 0);
  const isSoldOut = available <= 0;

  const MotionLink = motion.create(Link);

  return (
    <MotionLink 
      href={`/wines/${wine.slug}`} 
      className="group flex flex-col gap-5 relative rounded-sm transition-all duration-300"
      whileHover={{ scale: 1.02 }}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <motion.div 
        className="relative aspect-[3/4] w-full overflow-hidden bg-[#F5F5DC]/50 rounded-sm"
        whileHover={{ boxShadow: "0px 10px 30px rgba(74, 4, 4, 0.1)" }}
      >
        {wine.imageUrl ? (
          <Image
            src={wine.imageUrl}
            alt={wine.title}
            fill
            className={`object-cover transition-all duration-700 group-hover:scale-105 ${isSoldOut ? 'opacity-80 grayscale sm:grayscale-0' : ''}`}
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[#4A0404]/30 font-serif text-sm">
            Vintage Hidden
          </div>
        )}
        
        {/* Visual Scarcity Sub-System */}
        {isSoldOut ? (
          <div className="absolute top-4 right-4 bg-[#4A0404] text-[#F9F6EE] text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm shadow-sm backdrop-blur-md">
            Cellar Empty
          </div>
        ) : available <= 5 ? (
          <div className="absolute top-4 right-4 bg-[#B8860B] text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm shadow-sm backdrop-blur-md">
            Rare Vintage: Only {available} left!
          </div>
        ) : null}
      </motion.div>

      <div className="flex flex-col gap-1.5 text-center mt-1 px-2">
        <h3 className="font-serif text-lg tracking-wide text-[#4A0404] truncate transition-colors group-hover:text-[#4A0404]/70">
          {wine.title}
        </h3>
        <div className="flex items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-[#4A0404]/60">
          <span>{wine.vintage || "NV"}</span>
          <span>•</span>
          <span>${(wine.price / 100).toFixed(2)}</span>
        </div>
      </div>
    </MotionLink>
  );
}
