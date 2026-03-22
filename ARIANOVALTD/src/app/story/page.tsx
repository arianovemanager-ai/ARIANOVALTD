import FadeInView from "@/components/shared/FadeInView"

export default function StoryPage() {
  return (
    <div className="w-full bg-[#F9F6EE] min-h-screen">
      {/* 1. Title Banner */}
      <section className="pt-40 pb-20 px-6 text-center">
        <FadeInView direction="up">
          <h1 className="font-serif text-5xl md:text-7xl text-[#4A0404] tracking-wide mb-6">
            Global Sourcing & Distribution
          </h1>
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-[#4A0404]/60 font-semibold">
            ACQUISITION • COMPLIANCE • DISTRIBUTION
          </p>
        </FadeInView>
      </section>

      {/* 2. Editorial Text and Image Grid */}
      <section className="container mx-auto px-6 max-w-6xl pb-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-start">
          
          <div className="md:col-span-5 md:sticky top-32">
            <FadeInView direction="left">
               <h2 className="font-serif text-4xl text-[#4A0404] leading-tight mb-8">
                 Strategic partnerships for global distribution.
               </h2>
               <div className="w-12 h-px bg-[#4A0404] mb-8" />
               <p className="font-sans text-[#4A0404]/80 leading-relaxed font-light mb-6">
                 ARIANOVA is built on robust logistics and deep industry relationships. Our mission is to bridge the gap between world-class vineyards and premium retail markets, ensuring an efficient, reliable, and transparent supply chain.
               </p>
               <p className="font-sans text-[#4A0404]/80 leading-relaxed font-light">
                 We act as your dedicated distribution partner, guaranteeing impeccable provenance, temperature-controlled logistics, and seamless delivery directly to your business.
               </p>
            </FadeInView>
          </div>

          <div className="md:col-span-7 flex flex-col gap-12 mt-12 md:mt-0">
            <FadeInView direction="up" delay={0.2}>
              <div 
                className="w-full aspect-[4/5] bg-cover bg-center shadow-xl grayscale-[0.2] contrast-125"
                style={{ backgroundImage: "url('/images/cellar_editorial_1774069426378.png')" }}
              />
              <p className="text-right mt-4 text-[10px] uppercase font-bold tracking-[0.2em] text-[#4A0404]/50">
                The Arianova Portfolio Archives
              </p>
            </FadeInView>

            <FadeInView direction="up" delay={0.1}>
              <div className="bg-[#4A0404] text-[#F9F6EE] p-12 md:p-16 shadow-2xl mt-8">
                <blockquote className="font-serif text-2xl md:text-3xl leading-relaxed italic border-l-2 border-[#F9F6EE]/30 pl-8">
                  "Exceptional distribution requires more than logistics; it requires a profound respect for the product from the estate to its final destination."
                </blockquote>
              </div>
            </FadeInView>
          </div>

        </div>
      </section>
    </div>
  )
}
