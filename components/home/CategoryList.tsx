// 'use client'

// import { categories } from "@/utils/categories"
// import Link from "next/link"
// import { useSearchParams } from "next/navigation"

// const CategoryList = () => {
//     const searchParams = useSearchParams()
//     const currentSearch = searchParams.get('search') || ''
//     const currentCategory = searchParams.get('category') || ''

//     const createHref = (categoryLabel: string) => {
//         const label = categoryLabel.trim()
//         const params = new URLSearchParams()

//         if (currentSearch) {
//             params.set('search', currentSearch)
//         }

//         if (label !== "All") {
//             params.set('category', label)
//         }else {
//             // If "All" is selected, we should not set the category parameter
//             params.delete('category')
//         }

//         const queryString = params.toString()
//         return queryString ? `/?${queryString}` : `/`

//     }

//     return (
//         <div className="flex gap-4 my-6 flex-wrap justify-center">
//             {categories.map((item) => {
//                 const isActive =
//                     currentCategory === item.label ||
//                     (item.label === "All" && !currentCategory)

//                 return (
//                     <Link
//                         href={createHref(item.label)}
//                         key={item.label}
//                         className="group transition-all duration-300 hover:scale-110"
//                     >
//                         <article className={`p-4 rounded-lg flex flex-col justify-center items-center gap-2
//               ${isActive
//                                 ? 'bg-primary/10 text-primary'
//                                 : 'hover:bg-primary/5 hover:text-primary'
//                             }`}
//                         >
//                             <item.icon className={`w-6 h-6 ${isActive ? 'text-primary' : ''}`} />
//                             <p className="text-sm font-medium capitalize">{item.label}</p>
//                         </article>
//                     </Link>
//                 )
//             })}
//         </div>
//     )
// }

// export default CategoryList









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

'use client'
import { categories } from "@/utils/categories"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ChevronRight, Sparkles } from "lucide-react"

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
        } else {
            params.delete('category')
        }
        const queryString = params.toString()
        return queryString ? `/?${queryString}` : `/`
    }

    return (
        <div className="space-y-4">
            {/* Desktop View */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {categories.map((item, index) => {
                    const isActive =
                        currentCategory === item.label ||
                        (item.label === "All" && !currentCategory)
                    
                    return (
                        <Link
                            href={createHref(item.label)}
                            key={item.label}
                            className="group relative transition-all duration-300 hover:scale-105"
                        >
                            <article className={`
                                relative overflow-hidden rounded-2xl p-6 text-center
                                transition-all duration-300 transform
                                border-2 backdrop-blur-sm
                                ${isActive
                                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white border-blue-400 shadow-2xl shadow-blue-500/25'
                                    : 'bg-white/70 hover:bg-white border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-600 shadow-lg hover:shadow-xl'
                                }
                            `}>
                                {/* Background Pattern */}
                                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5"></div>
                                
                                {/* Active Indicator */}
                                {isActive && (
                                    <div className="absolute top-2 right-2">
                                        <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                                    </div>
                                )}
                                
                                {/* Content */}
                                <div className="relative z-10 space-y-3">
                                    {/* Icon Container */}
                                    <div className={`
                                        w-12 h-12 mx-auto rounded-full flex items-center justify-center
                                        transition-all duration-300
                                        ${isActive 
                                            ? 'bg-white/20 backdrop-blur-sm' 
                                            : 'bg-blue-50 group-hover:bg-blue-100'
                                        }
                                    `}>
                                        <item.icon className={`
                                            w-6 h-6 transition-all duration-300
                                            ${isActive 
                                                ? 'text-white' 
                                                : 'text-blue-500 group-hover:text-blue-600 group-hover:scale-110'
                                            }
                                        `} />
                                    </div>
                                    
                                    {/* Label */}
                                    <p className={`
                                        text-sm font-semibold capitalize transition-all duration-300
                                        ${isActive ? 'text-white' : 'text-gray-700 group-hover:text-blue-600'}
                                    `}>
                                        {item.label}
                                    </p>
                                </div>

                                {/* Hover Effect */}
                                <div className={`
                                    absolute inset-0 rounded-2xl transition-all duration-300
                                    ${isActive 
                                        ? 'bg-gradient-to-br from-white/10 to-transparent' 
                                        : 'bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5'
                                    }
                                `}></div>
                            </article>
                        </Link>
                    )
                })}
            </div>

            {/* Mobile View - Horizontal Scroll */}
            <div className="md:hidden">
                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                    {categories.map((item, index) => {
                        const isActive =
                            currentCategory === item.label ||
                            (item.label === "All" && !currentCategory)
                        
                        return (
                            <Link
                                href={createHref(item.label)}
                                key={item.label}
                                className="group flex-shrink-0 transition-all duration-300 hover:scale-105"
                            >
                                <article className={`
                                    relative overflow-hidden rounded-xl px-4 py-3 min-w-[120px]
                                    flex flex-col items-center gap-2 text-center
                                    transition-all duration-300 border-2
                                    ${isActive
                                        ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white border-blue-400 shadow-lg shadow-blue-500/25'
                                        : 'bg-white/80 hover:bg-white border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-600 shadow-md hover:shadow-lg'
                                    }
                                `}>
                                    {/* Icon */}
                                    <div className={`
                                        w-8 h-8 rounded-full flex items-center justify-center
                                        transition-all duration-300
                                        ${isActive 
                                            ? 'bg-white/20 backdrop-blur-sm' 
                                            : 'bg-blue-50 group-hover:bg-blue-100'
                                        }
                                    `}>
                                        <item.icon className={`
                                            w-4 h-4 transition-all duration-300
                                            ${isActive 
                                                ? 'text-white' 
                                                : 'text-blue-500 group-hover:text-blue-600'
                                            }
                                        `} />
                                    </div>
                                    
                                    {/* Label */}
                                    <p className={`
                                        text-xs font-semibold capitalize whitespace-nowrap
                                        transition-all duration-300
                                        ${isActive ? 'text-white' : 'text-gray-700 group-hover:text-blue-600'}
                                    `}>
                                        {item.label}
                                    </p>

                                    {/* Active Indicator for Mobile */}
                                    {isActive && (
                                        <div className="absolute top-1 right-1">
                                            <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
                                        </div>
                                    )}
                                </article>
                            </Link>
                        )
                    })}
                </div>
                
                {/* Scroll Indicator */}
                <div className="flex justify-center mt-2">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                        <span>เลื่อนเพื่อดูเพิ่มเติม</span>
                        <ChevronRight className="w-3 h-3" />
                    </div>
                </div>
            </div>

            {/* Category Stats
            <div className="flex justify-center mt-6">
                <div className="bg-white/60 backdrop-blur-lg rounded-full px-4 py-2 border border-white/20 shadow-lg">
                    <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-gray-700">
                                {categories.length} หมวดหมู่
                            </span>
                        </div>
                        {currentCategory && (
                            <>
                                <div className="w-px h-4 bg-gray-300"></div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-gray-700 font-medium">
                                        เลือก: {currentCategory}
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div> */}
        </div>
    )
}

export default CategoryList