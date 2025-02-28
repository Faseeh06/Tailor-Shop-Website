import type React from "react"
import { redirect } from "next/navigation"
import Link from "next/link"
import { LuLayoutDashboard, LuScissors, LuClipboardList, LuInbox, LuSettings } from "react-icons/lu"

// This would normally check your authentication state
const isTailor = true // Replace with actual auth check

export default function TailorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Protect tailor routes
  if (!isTailor) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-white shadow-md">
          <div className="p-4">
            <h2 className="text-xl font-bold text-gray-800">Tailor Portal</h2>
          </div>
          <nav className="mt-4">
            <Link
              href="/dashboard/tailor"
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
            >
              <LuLayoutDashboard className="mr-3" />
              Dashboard
            </Link>
            <Link
              href="/dashboard/tailor/orders"
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
            >
              <LuClipboardList className="mr-3" />
              Orders
            </Link>
            <Link
              href="/dashboard/tailor/measurements"
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
            >
              <LuScissors className="mr-3" />
              Measurements
            </Link>
            <Link
              href="/dashboard/tailor/inbox"
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
            >
              <LuInbox className="mr-3" />
              Inbox
            </Link>
            <Link
              href="/dashboard/tailor/settings"
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

