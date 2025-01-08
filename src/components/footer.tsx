import {
  Home,
  Bug,
  ShoppingBag,
  Users,
  SquareChartGantt,
  ListOrdered,
  BadgeDollarSign,
  ChartArea,
  KeyboardOff,
  Settings,
} from "lucide-react";
import Link from "next/link";

const links = [
  {
    id: 1,
    name: "Dashboard",
    icon: Home,
    href: "/123/dashboard",
  },
  // {
  //   id: 2,
  //   name: "Repairs",
  //   icon: Bug,
  //   href: "/",
  // },
  {
    id: 3,
    name: "Orders",
    icon: ShoppingBag,
    href: "/123/orders",
  },
  {
    id: 4,
    name: "Customers",
    icon: Users,
    href: "/",
  },
  {
    id: 5,
    name: "Products",
    icon: SquareChartGantt,
    href: "/123/products",
  },
  {
    id: 6,
    name: "Inventory",
    icon: ListOrdered,
    href: "/",
  },
  {
    id: 7,
    name: "Finance",
    icon: BadgeDollarSign,
    href: "/",
  },
  {
    id: 8,
    name: "Reports",
    icon: ChartArea,
    href: "/",
  },
  {
    id: 9,
    name: "Payouts",
    icon: KeyboardOff,
    href: "/",
  },
  {
    id: 10,
    name: "Settings",
    icon: Settings,
    href: "/123/settings",
  },
];

export function Footer() {
  return (
    <div className="h-[60px] bg-card text-card-foreground flex items-center justify-between px-4 lg:px-32 text-sm">
      {links.map((link) => (
        <Link
          key={link.id}
          href={link.href}
          className="flex items-center gap-1 p-2 rounded-lg bg-primary/10 transition-all duration-300"
        >
          <link.icon className="size-4" />
          <span>{link.name}</span>
        </Link>
      ))}
    </div>
  );
}
