import { getAllProducts } from "@/actions/products";
import Cart from "./cart";

export default async function CartPage() {
  const products = await getAllProducts();
  return (
    <div>
      <Cart products={products} />
    </div>
  );
}
