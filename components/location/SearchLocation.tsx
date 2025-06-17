'use client'
import { Search, X, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useDebounce } from 'use-debounce'

export default function SearchLocation() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(searchParams.get('search') || '')
  const [debouncedValue] = useDebounce(value, 500)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (debouncedValue) {
      params.set('search', debouncedValue)
    } else {
      params.delete('search')
    }
    router.push(`/locations?${params.toString()}`)
  }, [debouncedValue, router, searchParams])

  const clearSearch = () => {
    setValue('')
  }

  const suggestions = [
    'วัปปทุม', 'ปราสาทหิน', 'อุทยานแห่งชาติ', 'พระอาทิตย์ขึ้น', 'วัด'
  ]

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Main Search Input */}
      <div className={`relative group transition-all duration-300 ${
        isFocused ? 'transform scale-105' : ''
      }`}>
        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
          <Search className={`w-5 h-5 transition-colors duration-200 ${
            isFocused ? 'text-blue-500' : 'text-gray-400'
          }`} />
        </div>

        {/* Input Field */}
        <Input
          type="text"
          placeholder="ค้นหาสถานที่ท่องเที่ยว เช่น วัปปทุม, ปราสาทหิน..."
          className={`
            w-full pl-12 pr-12 py-4 text-lg
            bg-white/90 backdrop-blur-sm
            border-2 border-gray-200
            rounded-xl shadow-lg
            transition-all duration-300
            placeholder:text-gray-400
            focus:border-blue-400 focus:ring-4 focus:ring-blue-100
            hover:shadow-xl hover:bg-white
            ${isFocused ? 'bg-white shadow-2xl' : ''}
          `}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        />

        {/* Clear Button */}
        {value && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 
                     p-1 rounded-full hover:bg-gray-100 transition-colors duration-200
                     text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Loading indicator */}
        {value && value !== debouncedValue && (
          <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Search Suggestions */}
      {isFocused && !value && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-lg 
                      rounded-xl shadow-xl border border-gray-200 p-4 z-20
                      animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              <MapPin className="w-4 h-4" />
              <span className="font-medium">คำค้นหายอดนิยม</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setValue(suggestion)}
                  className="px-3 py-1.5 text-sm bg-blue-50 hover:bg-blue-100 
                           text-blue-700 rounded-full transition-colors duration-200
                           border border-blue-200 hover:border-blue-300"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search Status */}
      {debouncedValue && (
        <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>กำลังค้นหา "{debouncedValue}"</span>
        </div>
      )}
    </div>
  )
}