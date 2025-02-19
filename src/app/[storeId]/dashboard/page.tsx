import {
  getTotalOrdersToday,
  getTotalRepairsToday,
  getTotalSalesToday,
  getTotalWaitingToday,
} from "@/actions/order";
import { getStoreFromSession, getUserFromSession } from "@/actions/session";
import { PrintPage } from "@/components/print";
import { Button } from "@/components/ui/button";
import {
  Calculator,
  CalendarArrowDown,
  Group,
  Printer,
  ScanBarcode,
  ShoppingBag,
  ShoppingCart,
  Usb,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const storeId = await (await params)?.storeId;
  const orders = await getTotalOrdersToday();
  const sales = await getTotalSalesToday();
  const waiting = await getTotalWaitingToday();
  const repairs = await getTotalRepairsToday();
  const user = await getUserFromSession();
  const store = await getStoreFromSession();
  if (!user || !store) {
    return redirect("/auth/login");
  }
  return (
    <div className="p-4 lg:px-32 grid grid-cols-3 gap-4">
      <Link
        href={`/${storeId}/cart`}
        className="p-6 rounded-xl bg-primary flex flex-col gap-4"
      >
        <CalendarArrowDown className="size-16" />
        <p className="text-xl font-bold">Create Order</p>
      </Link>
      <Link
        href={`/${storeId}/create-repair`}
        className="p-6 rounded-xl bg-primary flex flex-col gap-4"
      >
        <Wrench className="size-16" />
        <p className="text-xl font-bold">Create Repair</p>
      </Link>
      <div className="p-6 rounded-xl bg-primary flex flex-col gap-4">
        <Group className="size-16" />
        <p className="text-xl font-bold">Team Task</p>
      </div>
      <Link
        href={`/${storeId}/edit-repair`}
        className="p-6 rounded-xl bg-primary flex flex-col gap-4"
      >
        <Wrench className="size-16" />
        <p className="text-xl font-bold">Manage Devices</p>
      </Link>
      <Link
        href={`/${storeId}/products`}
        className="p-6 rounded-xl bg-primary flex flex-col gap-4"
      >
        <ScanBarcode className="size-16" />
        <p className="text-xl font-bold">Electronic Devices</p>
      </Link>
      <Link
        href={`/${storeId}/products`}
        className="p-6 rounded-xl bg-primary flex flex-col gap-4"
      >
        <Usb className="size-16" />
        <p className="text-xl font-bold">Accessories</p>
      </Link>
      {user?.role === "MANAGER" && (
        <div className="p-6 rounded-xl bg-primary flex flex-col gap-4">
          <Calculator />
          <p>Here&apos;s what&apos;s happening with your store today</p>
          <div>
            <p className="font-bold text-primary">Total Sales</p>
            <p className="font-semibold">${sales}</p>
          </div>
          <div className="grid grid-cols-3">
            <div className="p-2 ring-1 ring-secondary-foreground text-center">
              <p>Orders</p>
              <p>{orders}</p>
            </div>
            <div className="p-2 ring-1 ring-secondary-foreground text-center">
              <p>Repairs</p>
              <p>{repairs}</p>
            </div>
            <div className="p-2 ring-1 ring-secondary-foreground text-center text-xs">
              <p>Waiting to be fixed</p>
              <p>{waiting}</p>
            </div>
          </div>
        </div>
      )}
      <div className="space-y-4">
        <Button className="w-full" asChild>
          <Link href="/123/cart">
            <ShoppingCart /> Go to Cart
          </Link>
        </Button>
        <Button variant={"secondary"} className="w-full">
          <Printer /> Print last order receipt
        </Button>
      </div>
      <PrintPage />
    </div>
  );
}
