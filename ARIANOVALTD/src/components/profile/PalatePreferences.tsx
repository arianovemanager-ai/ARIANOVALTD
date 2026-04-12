"use client"

import { useState } from "react"
import { completeOnboarding } from "@/app/actions/profile"
import { toast } from "sonner"
import { Grape, Wine, GlassWater, Sparkles } from "lucide-react"

export default function PalatePreferences({ initialPreferences, frequency }: { initialPreferences: string[], frequency: string }) {
  const [preferences, setPreferences] = useState<string[]>(initialPreferences || [])
  const [isSyncing, setIsSyncing] = useState(false)

  const togglePreference = async (val: string) => {
    const nextPrefs = preferences.includes(val) 
      ? preferences.filter(p => p !== val) 
      : [...preferences, val];
    
    setPreferences(nextPrefs)
    setIsSyncing(true)
    
    try {
      // Re-run the core Server Action natively intercepting payloads synchronously
      await completeOnboarding(nextPrefs, frequency)
      toast.success("Preferences Updated", { description: "Your palate dossier is synchronized natively." })
    } catch (e) {
      setPreferences(preferences) // Instantly Revert layouts on failure bounds
      toast.error("Sync Failed", { description: "Connection interrupted. Please resubmit changes." })
    } finally {
      setIsSyncing(false)
    }
  }

  const options = [
    { id: 'bold-reds', label: 'Bold Reds', icon: Grape },
    { id: 'light-reds', label: 'Light Reds', icon: Wine },
    { id: 'crisp-whites', label: 'Crisp Whites', icon: GlassWater },
    { id: 'sparkling', label: 'Sparkling', icon: Sparkles },
  ]

  return (
    <div className="flex flex-wrap gap-3">
      {options.map((item) => {
        const isSelected = preferences.includes(item.id)
        const Icon = item.icon
        return (
          <button
            key={item.id}
            disabled={isSyncing}
            onClick={() => togglePreference(item.id)}
            className={`px-4 py-2 border rounded-full flex items-center gap-2 transition-all ${
              isSelected 
                ? 'border-brand-accent bg-brand-accent/10 text-brand-accent shadow-[0_0_15px_rgba(212,175,55,0.1)]' 
                : 'border-brand-border/30 text-brand-foreground/60 hover:border-brand-accent/50 hover:bg-brand-surface/20'
            } disabled:opacity-50`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-xs uppercase tracking-widest font-semibold pb-px">
              {item.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
