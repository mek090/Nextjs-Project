'use client'

import { useActionState } from "react"
import { toast as sonnerToast } from "sonner"
import { useEffect } from "react"
import { actionFunction } from "@/utils/types"

interface FormState {
    message?: string;
    success?: boolean;
    [key: string]: any;
}

export function useToast() {
    return {
        toast: sonnerToast,
    }
}

const initialState: FormState = {
    message: '',
    success: false
}

const FormContainer = ({ action, children }: { action: actionFunction, children: React.ReactNode }) => {
    const { toast } = useToast()
    const [state, formAction] = useActionState(action, initialState)

    useEffect(() => {
        if (state?.message) {
            toast(state.success ? 'สำเร็จ' : 'เกิดข้อผิดพลาด', {
                description: state.message,
                duration: 3000,
                className: state.success ? 'bg-green-50' : 'bg-red-50'
            })
        }
    }, [state, toast])

    return (
        <form action={formAction}>
            {children}
        </form>
    )
}

export default FormContainer