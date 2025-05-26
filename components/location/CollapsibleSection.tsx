'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import Description from '@/components/location/Description'
import DescriptionAI from '@/components/location/DescriptionAI'

// Types for the component props
interface CollapsibleSectionProps {
    title: string
    content?: string  // For regular description
    type: 'description' | 'ai-description'
    locationName?: string  // For AI description
    locationDescription?: string  // For AI description  
    locationDistrict?: string  // For AI description
    locationCategory?: string  // For AI description
    locationLat?: number  // For AI description
    locationLng?: number  // For AI description
}

const CollapsibleSection = ({
    title,
    content,
    type,
    locationName,
    locationDescription,
    locationDistrict,
    locationCategory,
    locationLat,
    locationLng,
}: CollapsibleSectionProps) => {
    // State to track if the section is expanded or collapsed
    const [isExpanded, setIsExpanded] = useState(false)

    // Toggle expand/collapse state
    const toggleExpand = () => {
        setIsExpanded(!isExpanded)
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                    {title}
                </h2>
                <button
                    onClick={toggleExpand}
                    className="flex items-center text-blue-500 hover:text-blue-700 transition-colors"
                >
                    <span className="mr-1 text-sm">
                        {isExpanded ? 'แสดงน้อยลง' : 'แสดงเพิ่มเติม'}
                    </span>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
            </div>

            <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-full' : 'max-h-96'}`}>
                <div className={`${!isExpanded && 'line-clamp-3'}`}>
                    {type === 'description' && content && (
                        <Description description={content} />
                    )}

                    {type === 'ai-description' && locationName && locationDescription && (
                        <DescriptionAI
                            locationName={locationName}
                            locationDescription={locationDescription}
                            locationDistrict={locationDistrict || ''}
                            locationCategory={locationCategory || ''}
                            locationLat={locationLat}
                            locationLng={locationLng}
                        />
                    )}
                </div>

                {/* Gradient fade effect when collapsed */}

                {!isExpanded && (
                    <div className="h-16 bg-gradient-to-t from-white dark:from-gray-800 to-transparent w-full mt-[-50px] relative"></div>
                )}

                <button
                    onClick={toggleExpand}
                    className="flex items-center text-blue-500 hover:text-blue-700 transition-colors mt-5"
                >
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    <span className="mr-1 text-sm">
                        {isExpanded ? 'แสดงน้อยลง' : 'แสดงเพิ่มเติม'}
                    </span>
                </button>


            </div>

        </div>
    )
}

export default CollapsibleSection