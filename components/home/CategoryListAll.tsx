'use client'

import { categories } from "@/utils/categories"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

const CategoryList = () => {
    const searchParams = useSearchParams()
    const currentSearch = searchParams.get('search') || ''
    const currentCategory = searchParams.get('category') || ''

    const createHref = (categoryLabel: string) => {
        const params = new URLSearchParams()
        if (currentSearch) {
            params.set('search', currentSearch)
        }
        // Only set category parameter if not "All"
        if (categoryLabel !== "All") {
            params.set('category', categoryLabel)
        }
        return `/locations/?${params.toString()}`
    }

    return (
        <div>
            <div className="flex gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 my-3 sm:my-4 md:my-5 lg:my-6 flex-wrap justify-center">
                {categories.map((item) => {
                    const isActive = currentCategory === item.label || (item.label === "All" && !currentCategory)
                    
                    return (
                        <Link 
                            href={createHref(item.label)}
                            key={item.label}
                            className={`group transition-all duration-300 hover:scale-105 sm:hover:scale-110`}
                        >
                            <article className={`p-1.5 sm:p-2 md:p-3 lg:p-4 rounded-lg flex flex-col justify-center items-center gap-1 sm:gap-1.5 md:gap-2
                                ${isActive 
                                    ? 'bg-primary/10 text-primary' 
                                    : 'hover:bg-primary/5 hover:text-primary'
                                }`}
                            >
                                <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${isActive ? 'text-primary' : ''}`} />
                                <p className="text-xs sm:text-sm font-medium capitalize">{item.label}</p>
                            </article>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

export default CategoryList