import Link from "next/link"
import { Button } from "../ui/button"

const Logo = () => {
  return (
    <>
      <Button size='default' asChild>
        <Link href='/' className="flex items-center space-x-2">
          Logo
        </Link>
      </Button>
    </>
  )
}
export default Logo