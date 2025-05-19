'use client'

import { Button } from '../ui/button'
import { toast as sonnerToast } from "sonner"
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { SignOutButton, useClerk } from '@clerk/nextjs'

export function useToast() {
  return {
    toast: sonnerToast,
  }
}

const SignOutLink = () => {
  const { toast } = useToast()
  const { signOut } = useClerk()
  const router = useRouter()

  const handleLogout = useCallback(async () => {
    toast("Logout", {
      description: "You have successfully logged out.",
    //   action: {
    //     label: "Undo",
    //     onClick: () => {
    //       // ยังไม่สามารถ Undo การ logout ได้จริง
    //       toast("Undo not implemented")
    //     },
    //   },
    })

    await signOut(() => router.push("/"))
  }, [signOut, router, toast])

  return (
    <Button onClick={handleLogout}  className="w-full hover:translate-x-2 hover:bg-red-500 hover:text-white transition-all duration-300" variant="outline">
      SIGN OUT
    </Button>
  )
}

export default SignOutLink
