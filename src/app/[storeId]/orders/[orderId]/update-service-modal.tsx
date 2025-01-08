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
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createRepairBrand } from "@/actions/repair";
import { updateOrderItemStatus } from "@/actions/order";

const initialState = {
  success: false,
  message: "",
};

export function UpdateServiceModal({ item }: any) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [state, action, isPending] = useActionState(
    updateOrderItemStatus,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      toast({
        description: state.message || "Brand added successfully",
      });
      setOpen(false);
    } else if (state.message) {
      toast({
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state, toast]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-gray-600 h-8">
          {item.repairStatus}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={action}>
          <DialogHeader>
            <DialogTitle>Update Status</DialogTitle>
            <DialogDescription>
              Enter the name of the new brand you want to add.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <select
              className="bg-background p-3 rounded-md ring-1 ring-white"
              id="status"
              name="status"
              defaultValue={item.repairStatus}
            >
              <option value="">Select Status</option>
              <option value="WAITING_FOR_PARTS">Waiting for Parts</option>
              <option value="WORKING_ON_IT">Working on it</option>
              <option value="PENDING">Pending</option>
              <option value="FIXED">Fixed</option>
              <option value="PICKED_UP">Picked Up</option>
            </select>
            <Input id="id" name="id" value={item.id} type="hidden" />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
