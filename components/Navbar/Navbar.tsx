import NotificationDropdown from "../notifications/NotificationDropdown"
import { Darkmode } from "./Darkmode"
import { DropdownListmenu } from "./DropdownListmenu"
import Logo from "./Logo"
import Search from "./Search"

const Navbar = () => {
    return (
        <nav>
            <div className="container flex justify-between sm:flex-row sm:items-center sm:py-4 sm:px-6 mx-auto">

                <Logo />
                {/* <Search /> */}

                <div className="flex gap-4">
                    <Darkmode />
                    <NotificationDropdown />
                    <DropdownListmenu />
                </div>
            </div>

        </nav>
    )
}
export default Navbar