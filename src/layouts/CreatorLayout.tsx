import { Outlet } from "react-router-dom"

export function CreatorLayout() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <Outlet />
      </main>
    </div>
  )
}
