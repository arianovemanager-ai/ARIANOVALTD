import ProfileSidebar from "@/components/profile/ProfileSidebar"

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 bg-[#F9F6EE] py-12 min-h-screen">
      <div className="container mx-auto px-6 max-w-6xl flex flex-col md:flex-row gap-12">
        <ProfileSidebar />
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}
