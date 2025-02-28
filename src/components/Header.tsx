"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { getUserRole, isAuthenticated, logout } from "@/utils/auth"
import { useRouter } from "next/navigation"

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [userMenu, setUserMenu] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    setAuthenticated(isAuthenticated())
    setUserRole(getUserRole())
  }, [])

  const handleLogout = () => {
    logout()
    setAuthenticated(false)
    setUserRole(null)
    router.push('/login')
  }

  const getDashboardLink = () => {
    switch(userRole) {
      case 'admin': return '/admin/dashboard'
      case 'tailor': return '/tailor/dashboard'
      default: return '/customer/dashboard'
    }
  }

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-[#B17457]">Tailrezz</span>
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden rounded-md p-2 text-gray-600 hover:bg-gray-100"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="nav-link">
              Home
            </Link>
            <Link href="/gallery" className="nav-link">
              Gallery
            </Link>
            <Link href="/custom-order" className="nav-link">
              Custom Order
            </Link>
            <Link href="/reservations" className="nav-link">
              Reservations
            </Link>
            
            {authenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenu(!userMenu)}
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600"
                >
                  <span>Account</span>
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {userMenu && (
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-xl z-50">
                    <Link
                      href={getDashboardLink()}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="px-4 py-2 text-gray-600 hover:text-blue-600"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="mobile-nav-link">
                Home
              </Link>
              <Link href="/gallery" className="mobile-nav-link">
                Gallery
              </Link>
              <Link href="/custom-order" className="mobile-nav-link">
                Custom Order
              </Link>
              <Link href="/reservations" className="mobile-nav-link">
                Reservations
              </Link>
              
              {authenticated ? (
                <>
                  <Link href={getDashboardLink()} className="mobile-nav-link">
                    Dashboard
                  </Link>
                  <Link href="/profile" className="mobile-nav-link">
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-left px-4 py-2 text-gray-600 hover:text-blue-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-gray-600 hover:text-blue-600"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-center"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add global styles */}
      <style jsx>{`
        .nav-link {
          @apply text-gray-600 hover:text-[#B17457] transition-colors duration-200;
        }
        .mobile-nav-link {
          @apply block px-4 py-2 text-gray-600 hover:text-[#B17457];
        }
      `}</style>
    </header>
  )
}

export default Header

