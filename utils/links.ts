import { LucideIcon } from 'lucide-react';
import { User2, BellRing, UsersRound, UserRoundCog, LayoutDashboard, House, Heart, MapPin, Settings, Github, LifeBuoy, LogOut } from 'lucide-react';

export type NavbarLink = {
  href: string;
  label: string;
  icon: LucideIcon;
  disabled?: boolean;
  hidden?: boolean;
  role?: string;
};

export const links: NavbarLink[] = [
  { href: '/', label: 'Home', icon: House, hidden: false, },
  { href: '/locations', label: 'Locations', icon: MapPin, hidden: false, },

  { href: '/favorite', label: 'Favorite', icon: Heart, hidden: false, },
  // { href: '/notification', label: 'Notification', icon: BellRing, hidden: false, },
];
export const links2: NavbarLink[] = [
  { href: '/profile', label: 'Profile', icon: User2, hidden: false, },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, hidden: true, },
];
export const links3: NavbarLink[] = [
  { href: '/team', label: 'Team', icon: UsersRound, hidden: false, },
  { href: '/github', label: 'GitHub', icon: Github, disabled: true, hidden: false, },
  { href: '/support', label: 'Support', icon: LifeBuoy, hidden: false, },
];
export const links4: NavbarLink[] = [
  { href: '/dashboard/managelocation', label: 'Manage Location', icon: MapPin, hidden: false, },
  { href: '/dashboard/manageuser', label: 'Manage User', icon: UserRoundCog, hidden: false, },
];

