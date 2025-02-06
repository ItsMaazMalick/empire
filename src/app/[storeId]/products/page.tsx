import { getAllOrders } from "@/actions/order";
import { Products } from "./products";
import { getAllProducts } from "@/actions/products";
import { getAllVendors } from "@/actions/vendors";
import { getAllCategories } from "@/actions/categories";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default async function page() {
  const products = await getAllProducts();
  const safeProducts = products ?? [];
  const vendors = await getAllVendors();
  const safeVendors = vendors ?? [];
  const categories = await getAllCategories();
  const safeCategories = categories ?? [];

  return (
    <Suspense fallback={<Loader2 className="animate-spin" />}>
      <Products
        products={safeProducts}
        vendors={safeVendors}
        categories={categories}
      />
    </Suspense>
  );
}
