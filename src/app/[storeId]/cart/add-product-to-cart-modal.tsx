import { createCustomer } from "@/actions/customers";
import { createRepairSeries } from "@/actions/repair";
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

import { ArrowLeft, Download, Search } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddProductModal } from "../products/add-product-modal";
import { ProductsTable } from "./products-table";

const tabs = [
  { value: "all", label: "All Orders" }, // "all" can be a special case

  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "In Active" },
];

const initialState = {
  success: false,
  message: "",
};

export function AddProductToCartModal({ products }: any) {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [state, action, isPending] = useActionState(
    createCustomer,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      toast({
        description: state.message || "Customer added successfully",
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
          <Button className="bg-transparent hover:bg-transparent">
            <Input placeholder="Search by using title" />
          </Button>
        </DialogTrigger>
        <DialogContent className="md:min-w-[80%] max-h-[90%] overflow-y-auto">
          <form action={action}>
            <DialogHeader>
              <DialogTitle>Add Product to Cart</DialogTitle>
              {/* <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription> */}
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <Link href="/" className="hover:text-gray-300">
                    <ArrowLeft className="w-6 h-6" />
                  </Link>
                  <h1 className="text-2xl font-semibold">Products</h1>
                </div>
              </div> */}

              {/* Search and Filters */}
              <div className="mb-6">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <Input
                    placeholder="Search products name"
                    // placeholder="Search orders by IMEI, Order No, Customer, etc"
                    className="pl-10 bg-[#1A2337] border-gray-700 text-white placeholder:text-gray-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="bg-[#1A2337] p-1">
                    {tabs.map((tab) => (
                      <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className="text-gray-400 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                      >
                        {tab.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>

              {/* Table */}
              <ProductsTable
                products={products}
                activeTab={activeTab}
                searchQuery={searchQuery}
              />
            </div>

            {/* <DialogFooter>
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
            </DialogFooter> */}
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
