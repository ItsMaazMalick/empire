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

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const storeId = await (await params)?.storeId;
  return (
    <div className="p-4 lg:px-32 grid grid-cols-3 gap-4">
      <div className="p-6 rounded-xl bg-secondary text-white flex flex-col gap-4">
        <CalendarArrowDown className="size-16" />
        <p className="text-xl font-bold">Create Order</p>
      </div>
      <Link
        href={`/123/create-repair`}
        className="p-6 rounded-xl bg-secondary text-white flex flex-col gap-4"
      >
        <Wrench className="size-16" />
        <p className="text-xl font-bold">Create Repair</p>
      </Link>
      <div className="p-6 rounded-xl bg-secondary text-white flex flex-col gap-4">
        <Group className="size-16" />
        <p className="text-xl font-bold">Team Task</p>
      </div>
      <div className="p-6 rounded-xl bg-card text-white flex flex-col gap-4">
        <Wrench className="size-16" />
        <p className="text-xl font-bold">Manage Devices</p>
      </div>
      <div className="p-6 rounded-xl bg-card text-white flex flex-col gap-4">
        <ScanBarcode className="size-16" />
        <p className="text-xl font-bold">Electronic Devices</p>
      </div>
      <div className="p-6 rounded-xl bg-card text-white flex flex-col gap-4">
        <Usb className="size-16" />
        <p className="text-xl font-bold">Accessories</p>
      </div>
      <div className="p-6 rounded-xl bg-card text-white flex flex-col gap-4">
        <Calculator />
        <p>Here&apos;s what&apos;s happening with your store today</p>
        <div>
          <p className="font-bold text-primary">Total Sales</p>
          <p className="font-semibold">$0.0</p>
        </div>
        <div className="grid grid-cols-3">
          <div className="p-2 ring-1 ring-secondary-foreground text-center">
            <p>Orders</p>
            <p>0</p>
          </div>
          <div className="p-2 ring-1 ring-secondary-foreground text-center">
            <p>Repairs</p>
            <p>0</p>
          </div>
          <div className="p-2 ring-1 ring-secondary-foreground text-center text-xs">
            <p>Waiting to be fixed</p>
            <p>0</p>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <Button className="w-full">
          <ShoppingCart /> Go to Cart
        </Button>
        <Button variant={"ghost"} className="w-full">
          <Printer /> Print last order receipt
        </Button>
      </div>
    </div>
  );
}
