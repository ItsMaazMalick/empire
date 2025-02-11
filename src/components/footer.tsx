import { getStoreFromSession, getUserFromSession } from "@/actions/session";
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
import { redirect } from "next/navigation";

const links = [
  {
    id: 1,
    name: "Dashboard",
    icon: Home,
    href: "/dashboard",
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
    href: "/orders",
  },
  {
    id: 4,
    name: "Customers",
    icon: Users,
    href: "/dashboard",
  },
  {
    id: 5,
    name: "Products",
    icon: SquareChartGantt,
    href: "/products",
  },
  // {
  //   id: 6,
  //   name: "Inventory",
  //   icon: ListOrdered,
  //   href: "/",
  // },
  {
    id: 7,
    name: "Finance",
    icon: BadgeDollarSign,
    href: "/finances",
  },
  // {
  //   id: 8,
  //   name: "Reports",
  //   icon: ChartArea,
  //   href: "/",
  // },
  // {
  //   id: 9,
  //   name: "Payouts",
  //   icon: KeyboardOff,
  //   href: "/",
  // },
  {
    id: 10,
    name: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export async function Footer() {
  const user = await getUserFromSession();
  const store = await getStoreFromSession();
  if (!user || !store) {
    return redirect("/auth/login");
  }
  return (
    <div className="h-[60px] bg-card text-card-foreground flex items-center justify-between px-4 lg:px-32 text-sm">
      {links.map((link) => {
        if (user.role !== "MANAGER" && link.name === "Finance") {
          return null;
        } else {
          return (
            <Link
              key={link.id}
              href={`/${store.id}${link.href}`}
              className="flex items-center gap-1 p-2 rounded-lg bg-primary transition-all duration-300"
            >
              <link.icon className="size-4" />
              <span>{link.name}</span>
            </Link>
          );
        }
      })}
    </div>
  );
}
