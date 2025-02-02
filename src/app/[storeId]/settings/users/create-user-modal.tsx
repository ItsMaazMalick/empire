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
import { createUser, updateUser } from "@/actions/users";
import { User } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const initialState = {
  success: false,
  message: "",
};

export function CreateUserModal({
  role,
  user,
}: {
  role: "MANAGER" | "TECHNICIAN";
  user?: User;
}) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [state, action, isPending] = useActionState(
    user ? updateUser : createUser,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      toast({
        description: state.message || "user added successfully",
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
        <Button>{user ? "Edit user" : "Add user"}</Button>
      </DialogTrigger>
      <DialogContent className="">
        <form action={action}>
          <DialogHeader>
            <DialogTitle>{user ? "Edit User" : "Add User"}</DialogTitle>
            <DialogDescription>
              Enter the name of the new brand you want to add.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                className="col-span-3"
                defaultValue={user?.name || ""}
              />
            </div>
            <div className="">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                className="col-span-3"
                defaultValue={user?.email || ""}
              />
            </div>
            <div className="">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select name="role" required defaultValue={user?.role}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MANAGER">MANAGER</SelectItem>
                  <SelectItem value="TECHNICIAN">TECHNICIAN</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {role === "MANAGER" && (
              <div className="">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select name="status" required defaultValue={user?.status}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                    <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input id="password" name="password" className="col-span-3" />
            </div>
            <div className="">
              <Label htmlFor="phone" className="text-right">
                Phone (Optional)
              </Label>
              <Input
                id="phone"
                name="phone"
                defaultValue={user?.phone || ""}
                className="col-span-3"
              />
            </div>
            {/* <div className="">
              <Label htmlFor="payPerHour" className="text-right">
                Pay per hour
              </Label>
              <Input id="payPerHour" name="payPerHour" className="col-span-3" />
            </div> */}
            <div className="space-y-2">
              <Label htmlFor="calculateCommission" className="text-right">
                Calculate Commission on
              </Label>
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="commissionSales"
                    name="calculateCommition"
                    value="sales"
                    defaultChecked={user?.calculateCommition === "sales"}
                    className="h-4 w-4 rounded-full border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label
                    htmlFor="commissionSales"
                    className="text-sm font-medium"
                  >
                    Sales
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="commissionProfit"
                    name="calculateCommition"
                    value="profit"
                    defaultChecked={user?.calculateCommition === "profit"}
                    className="h-4 w-4 rounded-full border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label
                    htmlFor="commissionProfit"
                    className="text-sm font-medium"
                  >
                    Profit
                  </Label>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="refundCommition" className="text-right">
                Refund Commission
              </Label>
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="refundCommissionYes"
                    name="refundCommition"
                    value="yes"
                    defaultChecked={user?.refundCommition === true}
                    className="h-4 w-4 rounded-full border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label
                    htmlFor="refundCommissionYes"
                    className="text-sm font-medium"
                  >
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="refundCommissionNo"
                    name="refundCommition"
                    value="no"
                    defaultChecked={user?.refundCommition !== true}
                    className="h-4 w-4 rounded-full border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label
                    htmlFor="refundCommissionNo"
                    className="text-sm font-medium"
                  >
                    No
                  </Label>
                </div>
              </div>
            </div>
          </div>
          <p>Types of commition</p>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="">
              <Label htmlFor="accessoriesPercentage" className="text-right">
                Accessories %
              </Label>
              <Input
                id="accessoriesPercentage"
                name="accessoriesPercentage"
                type="number"
                className="col-span-3"
                defaultValue={user?.accessoriesPercentage || ""}
              />
            </div>
            <div className="">
              <Label htmlFor="electronicsPercentage" className="text-right">
                Electronic Devices %
              </Label>
              <Input
                id="electronicsPercentage"
                name="electronicsPercentage"
                type="number"
                defaultValue={user?.electronicsPercentage || ""}
                className="col-span-3"
              />
            </div>
            <div className="">
              <Label htmlFor="serviceProductsPercentage" className="text-right">
                Service Products %
              </Label>
              <Input
                id="serviceProductsPercentage"
                name="serviceProductsPercentage"
                type="number"
                defaultValue={user?.serviceProductsPercentage || ""}
                className="col-span-3"
              />
            </div>
            <div className="">
              <Label htmlFor="repairsPercentage" className="text-right">
                Repairs %
              </Label>
              <Input
                id="repairsPercentage"
                name="repairsPercentage"
                type="number"
                defaultValue={user?.repairsPercentage || ""}
                className="col-span-3"
              />
              {user && <input type="hidden" name="id" value={user.id} />}
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
  );
}
