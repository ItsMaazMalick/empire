import { getOrderById, getOrderForPrint } from "@/actions/order";
import { OrderPage } from "./order";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ storeId: string; orderId: string }>;
}) {
  const orderId = await (await params)?.orderId;
  const storeId = await (await params)?.storeId;
  const order = await getOrderById(orderId);
  // const orderForPrint = await getOrderForPrint();
  const baseUrl = process.env.BASE_URL;
  if (!order) {
    return redirect("/");
  }
  return (
    <Suspense fallback={<Loader2 className="animate-spin" />}>
      <OrderPage order={order} baseUrl={baseUrl} storeId={storeId} />
    </Suspense>
  );
}
