import { createRepairSeries, updateRepairPrice } from "@/actions/repair";
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
import { Pencil, Plus } from "lucide-react";
import { useActionState, useEffect, useState } from "react";

const initialState = {
  success: false,
  message: "",
};

export function EditPriceModal({
  item,
}: {
  item: {
    id: string;
    name: string;
    stock: number;
    cost: number;
    price: number;
    createdAt: Date;
    updatedAt: Date;
  };
}) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [state, action, isPending] = useActionState(
    updateRepairPrice,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      toast({
        description: state.message || "Price updated successfully",
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
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Pencil className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form action={action}>
            <DialogHeader>
              <DialogTitle>Add Series Line</DialogTitle>
              {/* <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription> */}
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={item.name}
                  className="col-span-3"
                />
                <Input type="hidden" name="modelId" value={item.id} />
              </div>

              <div className="flex items-center gap-4">
                <p className="w-[33%]">Stock</p>
                <p className="w-[33%]">Cost</p>
                <p className="w-[33%]">Price</p>
              </div>
              <div className="flex items-center gap-4">
                <Input
                  name="stock"
                  className="w-[33%]"
                  type="number"
                  defaultValue={item.stock}
                />
                <Input
                  name="cost"
                  className="w-[33%]"
                  type="number"
                  defaultValue={item.cost}
                />
                <Input
                  name="price"
                  className="w-[33%]"
                  type="number"
                  defaultValue={item.price}
                />
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
