import { getAllOrders } from "@/actions/order";
import { Products } from "./products";
import { getAllProducts } from "@/actions/products";
import { getAllVendors } from "@/actions/vendors";
import { getAllCategories } from "@/actions/categories";

export default async function page() {
  const products = await getAllProducts();
  const safeProducts = products ?? [];
  const vendors = await getAllVendors();
  const safeVendors = vendors ?? [];
  const categories = await getAllCategories();
  const safeCategories = categories ?? [];
  return (
    <div>
      <Products
        products={safeProducts}
        vendors={safeVendors}
        categories={categories}
      />
    </div>
  );
}
