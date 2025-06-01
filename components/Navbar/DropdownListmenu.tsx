'use client'

import { useEffect, useState } from "react"
import { useUser, useAuth } from "@clerk/nextjs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { AlignJustify, RotateCw } from "lucide-react"
import Link from "next/link"
import { links, links2, links3, links4 } from "@/utils/links"
import SignOutLink from "./SignOutLink"
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { findRoleprofile } from "@/actions/actions"
import { Skeleton } from "../ui/skeleton"

const menuGroups = [links, links2, links3]


export function DropdownListmenu() {
  const { user, isLoaded } = useUser()
  const [role, setRole] = useState()






  useEffect(() => {
    const fetchRole = async () => {
      if (isLoaded && user) {
        try {
          const mek = await findRoleprofile({ id: user.id });
          console.log('Profile:', mek);

          if (mek) {
            setRole(mek.role as any);
          }
        } catch (error) {
          console.error("Error fetching profile via server action:", error);
        }
      }
    };

    fetchRole();
  }, [isLoaded, user]);


  if (!isLoaded) {
    return (
      <>
        <button>

          <Skeleton className="w-10 h-10" />
          {/* <RotateCw className="animate-spin" /> */}
        </button>
      </>

    )
  }

  if (!user) {
    return (
      <div className="flex gap-2">
        <SignInButton mode="modal">
          <Button variant="outline">Sign In</Button>
        </SignInButton>
        <SignUpButton mode="modal">
          <Button>Sign Up</Button>
        </SignUpButton>
      </div>
    )
  }

  if (!role) {
    return (
      <button>
          <Skeleton className="w-10 h-10" />
          {/* <RotateCw className="animate-spin" /> */}
        </button>
    )
  }



  return (
    <>
      <SignedIn>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <AlignJustify />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <DropdownMenuGroup>
                  {group.map((item, itemIndex) => (
                    <DropdownMenuItem
                      key={itemIndex}
                      hidden={item.hidden && (role == "user")}
                      disabled={item.disabled}
                      className={`flex items-center gap-2 ${item.disabled ? "opacity-50 pointer-events-none cursor-not-allowed" : ""}`}
                    >
                      {!item.disabled ? (
                        <Link href={item.href} className="flex items-center gap-2 w-full">
                          <item.icon size={16} />
                          <span>{item.label}</span>
                        </Link>
                      ) : (
                        <>
                          <item.icon size={16} />
                          <span>{item.label}</span>
                        </>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
                {groupIndex !== menuGroups.length - 1 && <DropdownMenuSeparator />}
              </div>
            ))}
            <DropdownMenuSeparator />
            <SignOutLink />
          </DropdownMenuContent>
        </DropdownMenu>
      </SignedIn>

      <SignedOut>
        <div className="flex gap-2">
          <SignInButton mode="modal">
            <Button variant="outline">Sign In</Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button>Sign Up</Button>
          </SignUpButton>
        </div>
      </SignedOut>
    </>
  )
}
