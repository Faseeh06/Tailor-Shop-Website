import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { AuthProvider } from '@/context/AuthContext'

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Custom Tailor Shop",
  description: "Your one-stop shop for custom, tailor-made clothing",
    generator: ''
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          <main className="min-h-screen p-4 md:p-8">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}