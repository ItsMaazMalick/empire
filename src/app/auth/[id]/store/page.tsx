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
import { getStoreFromSession, getUserFromSession } from "@/actions/session";
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
    <div>
      <div className=" flex items-center justify-center bg-gray-100">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Available Stores
            </CardTitle>
            <CardDescription className="text-center">
              Fill in your details to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stores.map((store) => (
              <div key={store.id}>
                <StoreLogin userId={id}>
                  <p className="bg-gray-600 my-2 p-2 rounded-md cursor-pointer">
                    {store.name}
                  </p>
                </StoreLogin>
              </div>
            ))}
            <form
              className=""
              action={async () => {
                "use server";
                const cookieStore = await cookies();
                cookieStore.delete("user");
                cookieStore.delete("store");
                return redirect("/auth/login");
              }}
            >
              <Button type="submit" variant={"destructive"} className="w-fit">
                Logout
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      {user.role === "MANAGER" && <CreateStoreForm userId={id} />}
    </div>
  );
}
