export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Tuscany Sunset Vineyard Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all scale-105"
        style={{ backgroundImage: "url('/images/vineyard_sunset_hero_1774069413207.png')" }}
      />
      {/* Soft dark burgundy overlay */}
      <div className="absolute inset-0 bg-[#4A0404]/40 mix-blend-multiply pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a0101]/90 via-transparent to-[#1a0101]/30 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md pt-12">
        <div className="text-center mb-8 flex flex-col items-center">
          <h1 className="font-serif text-5xl md:text-6xl text-[#F5F5DC] tracking-[0.05em] mb-2 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">Arianova Estate</h1>
        </div>

        {children}
      </div>
    </div>
  )
}
