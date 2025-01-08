import { getAllOrders } from "@/actions/order";
import { Orders } from "./orders";

export default async function OrdersPage() {
  const orders = await getAllOrders();
  const safeOrders = orders ?? [];
  return (
    <div>
      <Orders orders={safeOrders} />
    </div>
  );
}
