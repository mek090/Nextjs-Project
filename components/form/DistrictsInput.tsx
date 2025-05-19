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

import { districts } from "@/utils/districts"



const DistrictsInput = ({ defaultValue }: { defaultValue?: string }) => {

    const name = "districts"

    return (
        <div>
            <Label htmlFor={name} className="capitalize block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                {name}
            </Label>

            <Select
                defaultValue={defaultValue || districts[0].DISTRICT_NAME}
                name={name}
                required>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a Provinces" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {
                            districts.map((item) => {
                                return (

                                    <SelectItem key={item.DISTRICT_ID} value={item.DISTRICT_NAME}>
                                        <span className="capitalize flex items.center gap-4">
                                            {item.DISTRICT_NAME}
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
export default DistrictsInput