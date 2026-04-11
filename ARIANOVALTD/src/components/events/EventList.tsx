"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import FadeInView from "@/components/shared/FadeInView";

export default function EventList({ events }: { events: any[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleFastCheckout = async (event: any) => {
    try {
      setLoadingId(event._id);

      // Fast checkout bypasses cart directly
      const payload = {
        items: [{
          id: event._id,
          title: event.title,
          quantity: 1, // Standardizing single RSVPs for fast checkout
          price: event.price,
          imageUrl: event.imageUrl
        }]
      };

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to initialize checkout");
      }

      // Redirect straight to Stripe
      window.location.href = data.url;
    } catch (err: any) {
      alert(err.message);
      setLoadingId(null);
    }
  };

  if (!events || events.length === 0) {
    return (
      <div className="flex justify-center py-32 text-[#4A0404]/60 font-serif italic text-xl">
        No upcoming experiences at this time.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-32">
      {events.map((event, index) => {
        const available = event.physical_stock - event.committed_stock;
        const isSoldOut = event.physical_stock <= 0 || available <= 0;
        const isImageRight = index % 2 === 0;

        const eventDate = new Date(event.date);

        return (
          <FadeInView key={event._id} direction="up">
            <div className={`flex flex-col md:flex-row gap-12 items-center ${isImageRight ? 'md:flex-row-reverse' : ''}`}>

              {/* Image Block */}
              <div className="w-full md:w-1/2 relative aspect-[4/5] overflow-hidden">
                <img
                  src={event.imageUrl || "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?q=80&w=1000&auto=format&fit=crop"}
                  alt={event.title}
                  className={`object-cover w-full h-full transition-transform duration-1000 hover:scale-105 ${isSoldOut ? 'grayscale opacity-80' : ''}`}
                />
              </div>

              {/* Text Block */}
              <div className="w-full md:w-1/2 flex flex-col justify-center px-4 md:px-12">
                <div className="flex gap-4 items-center mb-6">
                  <div className="px-3 py-1 border border-[#4A0404]/20 text-[#4A0404] text-xs uppercase tracking-[0.2em]">
                    {eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <span className="text-[#4A0404]/60 text-sm tracking-widest uppercase">{event.location}</span>
                </div>

                <h2 className="font-serif text-4xl md:text-5xl text-[#4A0404] mb-6 leading-tight">
                  {event.title}
                </h2>

                {/* Clean string fallback since rich text rendering is outside scope without sanity/portable-text */}
                <p className="text-[#4A0404]/80 text-lg leading-relaxed font-light mb-10">
                  Join us for an exclusive gathering. Reserve your placement.
                </p>

                <div className="border-t border-[#4A0404]/10 pt-8 flex items-center justify-between">
                  {event.price === 0 ? (
                    <span className="text-xl font-serif text-[#4A0404]">Complimentary</span>
                  ) : (
                    <span className="text-xl font-serif text-[#4A0404]">${event.price / 100} USD</span>
                  )}

                  {isSoldOut ? (
                    <span className="text-sm uppercase tracking-[0.2em] text-[#4A0404]/40 font-semibold px-6 py-3">
                      At Capacity
                    </span>
                  ) : (
                    <button
                      onClick={() => handleFastCheckout(event)}
                      disabled={loadingId === event._id}
                      className="px-8 py-3 bg-[#4A0404] text-[#F9F6EE] hover:bg-[#3A0303] disabled:opacity-50 transition-all text-xs font-semibold uppercase tracking-[0.2em]"
                    >
                      {loadingId === event._id ? 'Securing...' : 'RSVP'}
                    </button>
                  )}
                </div>
              </div>

            </div>
          </FadeInView>
        );
      })}
    </div>
  );
}
