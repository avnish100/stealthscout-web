"use client"

import { cn } from "@/lib/utils"
import { useState, useEffect, useRef } from "react"

interface CollapseProps {
  open: boolean
  children: React.ReactNode
  className?: string
}

export function Collapse({ open, children, className }: CollapseProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number>(0)

  useEffect(() => {
    if (ref.current) {
      // Add a small buffer (16px) to account for any spacing/margins
      setHeight(ref.current.scrollHeight + 16)
    }
  }, [ref, children, open]) // Add open to dependencies to recalculate on toggle

  return (
    <div
      className={cn(
        "overflow-hidden transition-all duration-300 ease-in-out",
        className
      )}
      style={{ height: open ? height : 0 }}
    >
      <div ref={ref} className="pb-2"> {/* Add bottom padding */}
        {children}
      </div>
    </div>
  )
}
