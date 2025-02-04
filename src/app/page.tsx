import { getStoreFromSession, getUserFromSession } from "@/actions/session";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getUserFromSession();
  const store = await getStoreFromSession();
  if (!user && !store) {
    return redirect("/auth/login");
  }
  if (!user) {
    return redirect("/auth/login");
  }
  if (!store) {
    return redirect(`/auth/${user.id}/store`);
  }
  return redirect(`/${store.id}/dashboard`);
}
