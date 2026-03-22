import FadeInView from "@/components/shared/FadeInView"
import Link from "next/link"

export default function VineyardPage() {
  return (
    <div className="w-full bg-[#F9F6EE]">
      {/* 1. The Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed transform scale-[1.02]"
          style={{ backgroundImage: "url('/images/vineyard_sunset_hero_1774069413207.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-[#F9F6EE]" />
        
        <FadeInView direction="up" delay={0.2} duration={0.8} className="relative z-10 text-center px-6">
          <p className="font-sans text-[10px] md:text-xs uppercase tracking-[0.4em] text-[#F9F6EE]/80 mb-6 font-semibold">
            Arianova Curators
          </p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-[#F9F6EE] tracking-wide drop-shadow-xl mb-8">
            Partner Estates
          </h1>
        </FadeInView>
      </section>

      {/* 2. Partner One Showcase */}
      <section className="py-32 px-6 bg-[#F9F6EE] w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <FadeInView direction="up" className="order-2 lg:order-1">
            <h2 className="font-serif text-4xl md:text-5xl text-[#4A0404] mb-4">Tenute Dello Jato</h2>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#4A0404]/60 mb-8 mt-2">
              Exclusively Partnered with the Dello Jato Estate
            </p>
            <div className="w-12 h-px bg-[#4A0404]/30 mb-8" />
            <p className="font-sans text-lg text-[#4A0404]/80 leading-relaxed font-light mb-8">
              Situated in the heart of the Italian countryside, Tenute Dello Jato represents the pinnacle of sustainable, low-yield viticulture. ARIANOVA serves as the exclusive distribution partner for their most sought-after reserves, guaranteeing a direct pipeline from their historic cellars to your premium retail and hospitality venues.
            </p>
            <Link 
              href="/" 
              className="inline-block border border-[#4A0404] text-[#4A0404] hover:bg-[#4A0404] hover:text-[#F9F6EE] px-8 py-4 uppercase tracking-[0.2em] text-xs font-bold transition-all"
            >
              Acquire the Vintage
            </Link>
          </FadeInView>
          <FadeInView direction="left" className="order-1 lg:order-2 h-96 lg:h-[500px]">
            <div 
              className="w-full h-full bg-cover bg-center shadow-xl"
              style={{ backgroundImage: "url('/images/macro_grapes_1774069440322.png')" }}
            />
          </FadeInView>
        </div>
      </section>

      {/* 3. Partner Two Showcase */}
      <section className="py-32 px-6 bg-[#4A0404] text-[#F9F6EE] w-full">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <FadeInView direction="right" className="h-96 lg:h-[500px]">
             <div 
              className="w-full h-full bg-cover bg-center shadow-2xl grayscale-[0.2]"
              style={{ backgroundImage: "url('/images/cellar_editorial_1774069426378.png')" }}
            />
          </FadeInView>
          <FadeInView direction="up">
            <h2 className="font-serif text-4xl md:text-5xl mb-4">Tenute Fosca</h2>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#F9F6EE]/60 mb-8 mt-2">
              Exclusively Sourced from the Fosca Vineyards
            </p>
            <div className="w-12 h-px bg-[#F9F6EE]/30 mb-8" />
            <p className="font-sans text-lg text-[#F9F6EE]/80 leading-relaxed font-light mb-8">
              A fiercely independent estate renowned for its uncompromising quality and terroir-driven expressions. We secure deep allocations of Tenute Fosca's flagship vintages, managing complex compliance and temperature-controlled logistics to supply your business with zero friction.
            </p>
            <Link 
              href="/" 
              className="inline-block border border-[#F9F6EE] text-[#F9F6EE] hover:bg-[#F9F6EE] hover:text-[#4A0404] px-8 py-4 uppercase tracking-[0.2em] text-xs font-bold transition-all"
            >
              Acquire the Vintage
            </Link>
          </FadeInView>
        </div>
      </section>
    </div>
  )
}
