import type React from "react"
import { redirect } from "next/navigation"
import Link from "next/link"
import { LuLayoutDashboard, LuUsers, LuScissors, LuClipboardList, LuSettings } from "react-icons/lu"

// This would normally check your authentication state
const isAdmin = true // Replace with actual auth check

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Protect admin routes
  if (!isAdmin) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-white shadow-md">
          <div className="p-4">
            <h2 className="text-xl font-bold text-gray-800">Admin Portal</h2>
          </div>
          <nav className="mt-4">
            <Link
              href="/dashboard/admin"
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
            >
              <LuLayoutDashboard className="mr-3" />
              Dashboard
            </Link>
            <Link
              href="/dashboard/admin/users"
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
            >
              <LuUsers className="mr-3" />
              Users
            </Link>
            <Link
              href="/dashboard/admin/tailors"
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
            >
              <LuScissors className="mr-3" />
              Tailors
            </Link>
            <Link
              href="/dashboard/admin/orders"
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
            >
              <LuClipboardList className="mr-3" />
              Orders
            </Link>
            <Link
              href="/dashboard/admin/settings"
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
            >
              <LuSettings className="mr-3" />
              Settings
            </Link>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}

