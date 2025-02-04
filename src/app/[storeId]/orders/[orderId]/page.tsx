import { getOrderById } from "@/actions/order";
import { OrderPage } from "./order";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const orderId = await (await params)?.orderId;
  const order = await getOrderById(orderId);
  if (!order) {
    return redirect("/");
  }
  return (
    <Suspense fallback={<Loader2 className="animate-spin" />}>
      <OrderPage order={order} />
    </Suspense>
  );
}
