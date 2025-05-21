'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"

interface ShowMoreSectionProps {
  items: any[]
  initialCount: number
  renderItem: (item: any) => React.ReactNode
}

export function ShowMoreSection({ items, initialCount, renderItem }: ShowMoreSectionProps) {
  const [showAll, setShowAll] = useState(false)
  const displayedItems = showAll ? items : items.slice(0, 3)

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {displayedItems.map(renderItem)}
      </div>
      {items.length > initialCount && (
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setShowAll(!showAll)}
          >
            <span>{showAll ? 'แสดงน้อยลง' : 'แสดงเพิ่มเติม'}</span>
            {showAll ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        </div>
      )}
    </div>
  )
} 