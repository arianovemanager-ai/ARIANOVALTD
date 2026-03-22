import { Award } from "lucide-react"

interface MembershipCardProps {
  fullName: string;
  joinDate: string;
  orderCount: number;
}

export default function MembershipCard({ fullName, joinDate, orderCount }: MembershipCardProps) {
  let tier = "Bronze"
  let gradient = "from-[#b87333] to-[#8a5626]" // Copper / Bronze Base
  
  // Calculate dynamic threshold tiers seamlessly tracking Sanity payloads natively
  if (orderCount >= 6) {
    tier = "Gold"
    gradient = "from-yellow-600 to-yellow-800"
  } else if (orderCount >= 3) {
    tier = "Silver"
    gradient = "from-gray-300 to-gray-400"
  }

  return (
    <div className={`relative overflow-hidden rounded-sm p-8 text-white shadow-xl bg-gradient-to-br ${gradient}`}>
      {/* Decorative Shimmer Layout Block */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10" />
      
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex justify-between items-start mb-12">
          <div>
            <h3 className="font-serif text-3xl mb-1 tracking-wide">{fullName || "Arianova Member"}</h3>
            <p className="text-xs uppercase tracking-widest opacity-80 font-semibold">
              Member Since {new Date(joinDate).getFullYear() || new Date().getFullYear()}
            </p>
          </div>
          <Award className="w-8 h-8 opacity-90" />
        </div>

        <div className="flex justify-between items-end border-t border-white/20 pt-4 mt-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-70 mb-1">Status Tier</p>
            <p className="font-serif text-2xl">{tier} Collector</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-70 mb-1">Acquisitions</p>
            <p className="font-sans font-medium text-lg">{orderCount} Vintages</p>
          </div>
        </div>
      </div>
    </div>
  )
}
