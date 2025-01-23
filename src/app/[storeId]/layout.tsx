import { getStoreFromSession, getUserFromSession } from "@/actions/session";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserFromSession();
  const store = await getStoreFromSession();
  if (!user && !store) {
    return redirect(`/auth/login`);
  }

  return (
    <div className="">
      <Navbar />
      <main className="h-[calc(100vh-120px)] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-card [&::-webkit-scrollbar-thumb]:bg-primary [&::-webkit-scrollbar-thumb]:rounded-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}
