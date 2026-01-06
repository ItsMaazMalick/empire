import { getAllStoresByUserId } from "@/actions/store";
import { CreateStoreForm } from "./create-store";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StoreLogin } from "./store-login";
import { getUserFromSession } from "@/actions/session";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";

export default async function CreateStorePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getUserFromSession();
  if (!user) {
    return redirect("/auth/login");
  }

  const id = await (await params)?.id;
  const stores = (await getAllStoresByUserId(id)) ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-4 py-10 md:px-6 lg:px-8">
        {/* Header */}
        <header className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-sky-400">
              Store Workspace
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
              Choose or create a store
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-400">
              Manage your existing stores or create a new one in a clean, focused
              workspace.
            </p>
          </div>
          <form
            action={async () => {
              "use server";
              const cookieStore = await cookies();
              cookieStore.delete("user");
              cookieStore.delete("store");
              return redirect("/auth/login");
            }}
          >
            <Button
              type="submit"
              variant="outline"
              className="border-slate-700 bg-slate-900/50 text-slate-200 hover:bg-slate-800"
            >
              Logout
            </Button>
          </form>
        </header>

        {/* Main content grid */}
        <main className="grid gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          {/* Stores list */}
          <Card className="border-slate-800 bg-slate-900/70 shadow-xl shadow-slate-950/40 backdrop-blur">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">
                    Available stores
                  </CardTitle>
                  <CardDescription className="mt-1 text-xs text-slate-400">
                    Select a store to log in using its secure PIN.
                  </CardDescription>
                </div>
                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                  {stores.length} active
                </span>
              </div>
            </CardHeader>
            <CardContent>
              {stores.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-800 bg-slate-900/70 px-4 py-8 text-center">
                  <p className="text-sm font-medium text-slate-200">
                    No stores found
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Create a new store to get started with your workspace.
                  </p>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {stores.map((store) => (
                    <StoreLogin key={store.id} userId={id}>
                      <button
                        type="button"
                        className="group flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-left text-sm font-medium text-slate-100 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-500/70 hover:bg-slate-900 hover:shadow-lg hover:shadow-sky-900/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold">
                            {store.name}
                          </span>
                          <span className="text-xs text-slate-500">
                            Click to login with PIN
                          </span>
                        </div>
                        <span className="text-xs text-sky-400 opacity-0 transition group-hover:opacity-100">
                          Open →
                        </span>
                      </button>
                    </StoreLogin>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t border-slate-800/80 bg-slate-900/60">
              <p className="text-xs text-slate-500">
                Your stores are linked to this account. Use different PINs for
                each store for better security.
              </p>
            </CardFooter>
          </Card>

          {/* Create store side card */}
          {user.role === "MANAGER" && (
            <div className="flex items-stretch">
              <Card className="flex w-full flex-col border-slate-800 bg-slate-900/70 shadow-xl shadow-slate-950/40 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">
                    Quick create
                  </CardTitle>
                  <CardDescription className="mt-1 text-xs text-slate-400">
                    Spin up a new store in seconds with a name and secure code.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-4">
                  <CreateStoreForm userId={id} variant="embedded" />
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

