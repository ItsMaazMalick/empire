import { getAllProducts } from "@/actions/products";
import Cart from "./cart";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default async function CartPage() {
  const products = await getAllProducts();
  return (
    <Suspense fallback={<Loader2 className="animate-spin" />}>
      <Cart products={products} />
    </Suspense>
  );
}
