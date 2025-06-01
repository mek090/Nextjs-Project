import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


export type FormInputProps = {
    name: string;
    type: string;
    label?: string;
    defaultValue?: string | null;
    placeholder?: string;
  };

const FormInput = (props: FormInputProps) => {
    const { name, type, label, defaultValue, placeholder } = props;
    return (
        <div>
            <Label htmlFor={name} className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                {label}
            </Label>
            <Input 
            name={name}
            type={type}
            placeholder={placeholder}
                defaultValue={defaultValue || undefined}
            className="mb-4" 
            />
        </div>
    )
}
export default FormInput