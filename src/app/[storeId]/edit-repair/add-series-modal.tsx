import { createRepairSeries, updateRepairSeries } from "@/actions/repair";
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
import { useActionState, useEffect, useState } from "react";

const initialState = {
  success: false,
  message: "",
};

export function AddSeriesModal({
  children,
  brandId,
  series,
}: {
  children: React.ReactNode;
  brandId: string;
  series?: any;
}) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [state, action, isPending] = useActionState(
    series ? updateRepairSeries : createRepairSeries,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      toast({
        description: state.message || "Series added successfully",
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
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form action={action}>
            <DialogHeader>
              <DialogTitle>{series ? "Update" : "Add"} Series Line</DialogTitle>
              {/* <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription> */}
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  defaultValue={series?.name}
                  id="name"
                  name="name"
                  className="col-span-3"
                />
                <Input type="hidden" name="brandId" value={brandId} />
                {series && (
                  <Input type="hidden" name="seriesId" value={series?.id} />
                )}
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
