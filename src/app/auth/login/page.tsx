import { getStoreFromSession, getUserFromSession } from "@/actions/session";
import { LoginForm } from "./login";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const user = await getUserFromSession();
  const store = await getStoreFromSession();
  if (user && !store) {
    return redirect(`/auth/${user.id}/store`);
  }
  if (store && !user) {
    return redirect("/auth/login");
  }
  if (store && user) {
    return redirect(`/${store.id}/dashboard`);
  }
  return (
    <div>
      <LoginForm />
    </div>
  );
}
