import { getStoreFromSession } from "@/actions/session";
import { CalendarArrowDown } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Settings() {
  const store = await getStoreFromSession();
  if (!store) {
    return redirect("/auth/login");
  }
  return (
    <div className="p-4 lg:px-32 grid grid-cols-2 gap-4">
      <Link
        href={`/${store.id}/settings/users`}
        className="p-6 rounded-xl bg-primary flex flex-col gap-4"
      >
        <div className="flex items-center gap-4">
          <CalendarArrowDown className="size-10" />
          <p className="text-xl font-bold">Users</p>
        </div>
        <p className="text">
          Add and manage what staff can see or do in your store
        </p>
      </Link>
    </div>
  );
}
