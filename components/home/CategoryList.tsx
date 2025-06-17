'use client'

import { categories } from "@/utils/categories"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

const CategoryList = () => {
    const searchParams = useSearchParams()
    const currentSearch = searchParams.get('search') || ''
    const currentCategory = searchParams.get('category') || ''

    const createHref = (categoryLabel: string) => {
        const label = categoryLabel.trim()
        const params = new URLSearchParams()

        if (currentSearch) {
            params.set('search', currentSearch)
        }

        if (label !== "All") {
            params.set('category', label)
        }else {
            // If "All" is selected, we should not set the category parameter
            params.delete('category')
        }

        const queryString = params.toString()
        return queryString ? `/locations?${queryString}` : `/locations`

    }

    return (
        <div className="flex gap-4 my-6 flex-wrap justify-center">
            {categories.map((item) => {
                const isActive =
                    currentCategory === item.label ||
                    (item.label === "All" && !currentCategory)

                return (
                    <Link
                        href={createHref(item.label)}
                        key={item.label}
                        className="group transition-all duration-300 hover:scale-110"
                    >
                        <article className={`p-4 rounded-lg flex flex-col justify-center items-center gap-2
              ${isActive
                                ? 'bg-primary/10 text-primary'
                                : 'hover:bg-primary/5 hover:text-primary'
                            }`}
                        >
                            <item.icon className={`w-6 h-6 ${isActive ? 'text-primary' : ''}`} />
                            <p className="text-sm font-medium capitalize">{item.label}</p>
                        </article>
                    </Link>
                )
            })}
        </div>
    )
}

export default CategoryList









// 'use client'

// import { useRouter, useSearchParams } from 'next/navigation'

// const categories = [
//     { id: 'all', name: 'ทั้งหมด' },
//     { id: 'temple', name: 'วัด' },
//     { id: 'nature', name: 'ธรรมชาติ' },
//     { id: 'culture', name: 'วัฒนธรรม' },
//     { id: 'shopping', name: 'ช้อปปิ้ง' },
//     { id: 'restaurant', name: 'ร้านอาหาร' },
// ]

// const CategoryList = () => {
//     const router = useRouter()
//     const searchParams = useSearchParams()
//     const currentCategory = searchParams.get('category') || 'all'

//     const handleCategoryClick = (categoryId: string) => {
//         const params = new URLSearchParams(searchParams.toString())
//         if (categoryId === 'all') {
//             params.delete('category')
//         } else {
//             params.set('category', categoryId)
//         }
//         router.push(`/?${params.toString()}`)
//     }

//     return (
//         <div className="flex justify-center gap-2 my-4 flex-wrap">
//             {categories.map((category) => (
//                 <button
//                     key={category.id}
//                     onClick={() => handleCategoryClick(category.id)}
//                     className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
//                         ${currentCategory === category.id
//                             ? 'bg-blue-500 text-white'
//                             : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
//                         }`}
//                 >
//                     {category.name}
//                 </button>
//             ))}
//         </div>
//     )
// }

// export default CategoryList