"use client";

import { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createStore } from "@/actions/store";
import { cn } from "@/lib/utils";

const initialState = {
  success: false,
  message: "",
};

export function CreateStoreForm({
  userId,
  variant = "full",
}: {
  userId?: string;
  variant?: "full" | "embedded";
}) {
  const { toast } = useToast();
  const [state, action, isPending] = useActionState(createStore, initialState);

  useEffect(() => {
    if (state.success) {
      toast({
        description: state.message || "Store created successfully",
      });
    } else if (state.message) {
      toast({
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state, toast]);

  const isFull = variant === "full";

  return (
    <div
      className={cn(
        "w-full",
        isFull &&
          "min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 py-10"
      )}
    >
      <div
        className={cn(
          "w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur",
          !isFull && "border-none bg-transparent p-0 shadow-none"
        )}
      >
        {isFull && (
          <div className="mb-6 text-center">
            <p className="text-xs uppercase tracking-[0.25em] text-sky-400">
              New store
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-50">
              Create your store
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Choose a memorable name and a secure code to access your store.
            </p>
          </div>
        )}

        <form action={action} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs uppercase text-slate-400">
              Store name
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Empire Electronics"
              required
              className="h-10 rounded-lg border-slate-700 bg-slate-900/80 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:ring-sky-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="code" className="text-xs uppercase text-slate-400">
              Store code / PIN
            </Label>
            <Input
              id="code"
              name="code"
              type="text"
              placeholder="e.g. 1234"
              required
              className="h-10 rounded-lg border-slate-700 bg-slate-900/80 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:ring-sky-500"
            />
            <p className="text-[11px] text-slate-500">
              Use a 4–6 digit code that managers and staff can remember easily.
            </p>
            {userId && (
              <Input
                id="userId"
                name="userId"
                type="hidden"
                defaultValue={userId}
              />
            )}
          </div>
          <Button
            className="mt-2 h-10 w-full rounded-lg bg-sky-500 text-sm font-medium text-slate-950 shadow-lg shadow-sky-900/40 transition hover:bg-sky-400 disabled:opacity-60"
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Creating..." : "Create store"}
          </Button>
        </form>
      </div>
    </div>
  );
}
