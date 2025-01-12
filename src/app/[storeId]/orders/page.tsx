import { getAllOrders } from "@/actions/order";
import { Orders } from "./orders";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default async function OrdersPage() {
  const orders = await getAllOrders();
  const safeOrders = orders ?? [];
  return (
    <Suspense fallback={<Loader2 className="animate-spin" />}>
      <Orders orders={safeOrders} />
    </Suspense>
  );
}
