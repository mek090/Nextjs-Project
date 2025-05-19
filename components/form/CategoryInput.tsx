import { Label } from "@/components/ui/label"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { categories } from "@/utils/categories"



const CategoryInput = ({ defaultValue }: { defaultValue?: string }) => {

    const name = "category"

    return (
        <div>
            <Label htmlFor={name} className="capitalize block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                {name}
            </Label>

            <Select
                defaultValue={defaultValue || categories[0].label}
                name={name}
                required>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {
                            categories.map((item) => {
                                return (

                                    <SelectItem key={item.label} value={item.label}>
                                        <span className="capitalize flex items.center gap-4">
                                            <item.icon />
                                            {item.label}
                                        </span>
                                    </SelectItem>
                                )
                            })
                        }
                    </SelectGroup>
                    
                </SelectContent>
            </Select>
        </div>
    )
}
export default CategoryInput