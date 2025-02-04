import { getAllOrders } from "@/actions/order";
import { Orders } from "./orders";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { getStoreFromSession } from "@/actions/session";

export default async function OrdersPage() {
  const orders = await getAllOrders();
  const safeOrders = orders ?? [];
  const store = await getStoreFromSession();
  return (
    <Suspense fallback={<Loader2 className="animate-spin" />}>
      <Orders orders={safeOrders} store={store} />
    </Suspense>
  );
}
