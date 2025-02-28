import type React from "react"
export const Card = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return (
    <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`} data-v0-t="card">
      {children}
    </div>
  )
}

