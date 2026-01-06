"use client";

import { useState, useEffect, useActionState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { loginStore } from "@/actions/auth";
import { useRouter } from "next/navigation";

const initialState = {
  id: "",
  success: false,
  message: "",
};

export function StoreLogin({
  userId,
  children,
}: {
  userId: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [state, action, isPending] = useActionState(loginStore, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast({
        description: state.message || "Logged in to store",
      });
      router.push(`/${state.id}/dashboard`);
      setOpen(false);
    } else if (state.message) {
      toast({
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state, toast, router]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[420px] border-slate-800 bg-slate-900/95 text-slate-100 backdrop-blur">
        <form action={action} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              Login to store
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Enter your store PIN to securely access the dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-4 items-center gap-3">
              <Label
                htmlFor="code"
                className="col-span-1 text-xs font-medium text-slate-300"
              >
                Store PIN
              </Label>
              <Input
                id="code"
                name="code"
                className="col-span-3 h-9 rounded-lg border-slate-700 bg-slate-900/80 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:ring-sky-500"
                placeholder="••••"
              />
              <Input
                name="userId"
                defaultValue={userId}
                type="hidden"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter className="mt-2 flex flex-row items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="h-9 rounded-lg border-slate-700 bg-slate-900/60 text-xs text-slate-200 hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="h-9 rounded-lg bg-sky-500 px-4 text-xs font-medium text-slate-950 shadow-md shadow-sky-900/40 hover:bg-sky-400 disabled:opacity-60"
            >
              {isPending ? "Please wait..." : "Login"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
