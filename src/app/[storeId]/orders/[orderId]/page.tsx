import { getOrderById } from "@/actions/order";
import { OrderPage } from "./order";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const orderId = await (await params)?.orderId;
  const order = await getOrderById(orderId);
  return (
    <div>
      <OrderPage order={order} />
    </div>
  );
}
