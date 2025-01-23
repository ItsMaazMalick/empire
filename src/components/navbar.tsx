import { siteTitle } from "@/constants/data";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getUserFromSession } from "@/actions/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function Navbar() {
  const user = await getUserFromSession();
  return (
    <div className="h-[60px] bg-card text-card-foreground flex items-center justify-between p-4">
      <h2 className="text-2xl font-bold">{siteTitle}</h2>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-2 hover:bg-primary/80 transition-all duration-300 py-1 px-2 cursor-pointer rounded-md">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-sm">
              MM
            </div>
            <div>
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">Stone Owner</p>
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-card text-card-foreground">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>
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
                  variant={"destructive"}
                  className="w-full"
                >
                  Logout
                </Button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
