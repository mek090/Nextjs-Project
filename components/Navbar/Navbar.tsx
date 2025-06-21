import NotificationDropdown from "../notifications/NotificationDropdown"
import { Darkmode } from "./Darkmode"
import { DropdownListmenu } from "./DropdownListmenu"
import Logo from "./Logo"
import Search from "./Search"

const Navbar = () => {
    return (
        <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between py-3 sm:py-4 lg:py-5">
                    <Logo />

                    {/* Search - Hidden on mobile, shown on larger screens */}
                    {/* <div className="hidden md:block flex-1 max-w-md mx-4 lg:mx-8">
                        <Search />
                    </div> */}

                    <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                        <Darkmode />
                        <NotificationDropdown />
                        <DropdownListmenu />
                    </div>
                </div>
            </div>
        </nav>
    )
}
export default Navbar