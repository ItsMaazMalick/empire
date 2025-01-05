import { CalendarArrowDown } from "lucide-react";
import Link from "next/link";

export default function Settings() {
  return (
    <div className="p-4 lg:px-32 grid grid-cols-2 gap-4">
      <Link
        href="/123/settings/users"
        className="p-6 rounded-xl bg-card text-white flex flex-col gap-4"
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
