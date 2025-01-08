import { createCategory } from "@/actions/categories";
import { createCustomer } from "@/actions/customers";
import { createRepairSeries } from "@/actions/repair";
import { createVendor } from "@/actions/vendors";
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
import { DialogClose } from "@radix-ui/react-dialog";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";

const initialState = {
  success: false,
  message: "",
};

export function AddCategoryModal() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [state, action, isPending] = useActionState(
    createCategory,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      toast({
        description: state.message || "Category added successfully",
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
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant={"link"} className="w-fit">
            Add Category
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form action={action}>
            <DialogHeader>
              <DialogTitle>Add Category</DialogTitle>
              {/* <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription> */}
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" name="name" className="col-span-3" />
              </div>
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
    </div>
  );
}
