import { Outlet } from "react-router-dom"
import { AdminSidebar } from "../components/AdminSidebar"

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="lg:ml-64 pt-16 min-h-screen transition-all duration-300">
        <div className="container max-w-7xl mx-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
