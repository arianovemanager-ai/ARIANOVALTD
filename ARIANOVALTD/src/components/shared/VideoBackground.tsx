"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface VideoBackgroundProps {
  src: string;
  overlayOpacity?: number; // 0 to 1
  className?: string;
  poster?: string;
}

export default function VideoBackground({
  src,
  overlayOpacity = 0.6,
  className = "",
  poster,
}: VideoBackgroundProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Fallback trigger: if video is already ready when component mounts
  useEffect(() => {
    setIsLoaded(false); // Reset on source change
  }, [src]);

  const handleLoaded = () => setIsLoaded(true);

  return (
    <div className={`absolute inset-0 w-full h-full overflow-hidden z-0 ${className}`}>
      {/* Video Element */}
      <video
        key={src}
        ref={(el) => {
          if (el && el.readyState >= 3) {
            handleLoaded();
          }
        }}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        tabIndex={-1}
        onLoadedData={handleLoaded}
        onCanPlay={handleLoaded}
        onLoadedMetadata={handleLoaded}
        className={`w-full h-full object-cover transition-opacity duration-1000 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        poster={poster}
      >
        <source src={src} type="video/mp4" />
      </video>

      {/* Noir Deep Dark Overlay */}
      <div 
        className="absolute inset-0 z-10"
        style={{ 
          background: `linear-gradient(to bottom, rgba(11, 11, 11, ${overlayOpacity}), rgba(11, 11, 11, ${overlayOpacity + 0.1}))`,
          backdropFilter: "contrast(110%) brightness(90%)" 
        }}
      />
      
      {/* Subtle Vignette for that premium feel */}
      <div className="absolute inset-0 z-15 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />
      
      {/* Noise Grain Overlay for texture */}
      <div className="absolute inset-0 z-[16] opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }} />

      {/* Fallback/Initial state while loading */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-brand-bg z-20"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
