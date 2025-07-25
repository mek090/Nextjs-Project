'use client'

import { useEffect, useState } from "react"
import { useUser, useAuth } from "@clerk/nextjs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { AlignJustify, RotateCw } from "lucide-react"
import Link from "next/link"
import { links, links2,  links4 } from "@/utils/links"
import SignOutLink from "./SignOutLink"
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { findRoleprofile } from "@/actions/actions"
import { Skeleton } from "../ui/skeleton"

const menuGroups = [links, links2]


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

          <Skeleton className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10" />
        </button>
      </>

    )
  }

  if (!user) {
    return (
      <div className="flex gap-1 sm:gap-2">
        <SignInButton mode="modal">
          <Button variant="outline" size="sm" className="h-8 px-2 sm:h-9 sm:px-3 text-xs sm:text-sm">
            Sign In
          </Button>
        </SignInButton>
        <SignUpButton mode="modal">
          <Button size="sm" className="h-8 px-2 sm:h-9 sm:px-3 text-xs sm:text-sm">
            Sign Up
          </Button>
        </SignUpButton>
      </div>
    )
  }

  if (!role) {
    return (
      <button>
          <Skeleton className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10" />
        </button>
    )
  }



  return (
    <>
      <SignedIn>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10">
              <AlignJustify className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-48 sm:w-56 lg:w-64">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <DropdownMenuGroup>
                  {group.map((item, itemIndex) => (
                    <DropdownMenuItem
                      key={itemIndex}
                      hidden={item.hidden && (role == "user")}
                      disabled={item.disabled}
                      className={`flex items-center gap-2 text-sm sm:text-base ${item.disabled ? "opacity-50 pointer-events-none cursor-not-allowed" : ""}`}
                    >
                      {!item.disabled ? (
                        <Link href={item.href} className="flex items-center gap-2 w-full">
                          <item.icon size={16} className="flex-shrink-0" />
                          <span>{item.label}</span>
                        </Link>
                      ) : (
                        <>
                          <item.icon size={16} className="flex-shrink-0" />
                          <span>{item.label}</span>
                        </>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
                {/* {groupIndex !== menuGroups.length - 1 && <DropdownMenuSeparator />} */}
              </div>
            ))}
            <DropdownMenuSeparator />
            <SignOutLink />
          </DropdownMenuContent>
        </DropdownMenu>
      </SignedIn>

      <SignedOut>
        <div className="flex gap-1 sm:gap-2">
          <SignInButton mode="modal">
            <Button variant="outline" size="sm" className="h-8 px-2 sm:h-9 sm:px-3 text-xs sm:text-sm">
              Sign In
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button size="sm" className="h-8 px-2 sm:h-9 sm:px-3 text-xs sm:text-sm">
              Sign Up
            </Button>
          </SignUpButton>
        </div>
      </SignedOut>
    </>
  )
}
