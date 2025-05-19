import { Textarea } from "@/components/ui/textarea"
import { Label } from "@radix-ui/react-label"

interface TextareaInputProps {
    name: string;
    LabelText?: string;
    defaultValue?: string;
    required?: boolean;
}

const TextareaInput = ({ 
    name, 
    LabelText, 
    defaultValue, 
    required = true 
}: TextareaInputProps) => {
    return (
        <div className="mb-4">
            <Label htmlFor={name} className='capitalize'>
                {LabelText || name}
            </Label>
            <Textarea
                placeholder="Type Description here."
                id={name}
                name={name}
                defaultValue={defaultValue}
                rows={5}
                required={required}
                className="mt-1"
            />
        </div>
    )
}

export default TextareaInput