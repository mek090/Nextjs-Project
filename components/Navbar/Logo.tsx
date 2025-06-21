import Link from "next/link"
import { Button } from "../ui/button"

const Logo = () => {
  return (
    <>
      <Button size='default' asChild className="h-8 sm:h-9 lg:h-10 px-2 sm:px-3 lg:px-4">
        <Link href='/' className="flex items-center space-x-1 sm:space-x-2">
          <span className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Logo
          </span>
        </Link>
      </Button>
    </>
  )
}
export default Logo