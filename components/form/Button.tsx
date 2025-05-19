'use client'
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "../ui/button"
import { use } from "react";
import { RotateCw } from 'lucide-react';


type btnSize = 'default' | 'sm' | 'lg' | 'icon'

type SubmitButtonProps = {
    className?: string;
    size?: btnSize;
    text?: string;
};

const SubmitButton = ({ className, size, text }: SubmitButtonProps) => {

    const { pending } = useFormStatus();

    return (
        <Button
            disabled={pending}
            type="submit"
            size={size}
            className={`${className} capitalize`}
        >

            {
                pending
                    ? <>
                        <RotateCw className="animate-spin" />
                    <span>Please Wait...</span>
                    </>
                    : text
            }


        </Button>
    )
}
export default SubmitButton