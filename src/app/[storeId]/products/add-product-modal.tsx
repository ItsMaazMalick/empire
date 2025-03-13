"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { AddVendorModal } from "./add-vendor-modal";
import { AddCategoryModal } from "./add-category-modal";
import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";
import { createProduct, updateProduct } from "@/actions/products";

const initialState = {
  success: false,
  message: "",
};

import {
  useState,
  useEffect,
  useCallback,
  startTransition,
  useActionState,
} from "react"; // Import startTransition

export function AddProductModal({
  children,
  vendors,
  categories,
  product,
}: any) {
  const [image, setImage] = useState<string | undefined>();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [state, action, isPending] = useActionState(
    product ? updateProduct : createProduct,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      toast({
        description: state.message || "Product added successfully",
      });
      setOpen(false);
    } else if (state.message) {
      toast({
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state, toast]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      // Create FormData
      const formData = new FormData(e.target as HTMLFormElement);
      if (image) {
        formData.append("image", image);
      } else if (product?.image) {
        formData.append("image", product?.image);
      }

      // Use startTransition to dispatch the async action within a concurrent context
      startTransition(() => {
        action(formData); // Dispatch the action asynchronously
      });
    },
    [action, image]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-full md:min-w-[90%] max-h-[90%] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{product ? "Update" : "Add"} Product</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div>
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                defaultValue={product?.title}
                id="title"
                name="title"
                className="col-span-3"
              />
            </div>
            <div>
              <Label htmlFor="description" className="text-right">
                Short Description
              </Label>
              <Textarea
                defaultValue={product?.description}
                id="description"
                name="description"
                className="col-span-3"
              />
            </div>
            <div>
              <Label htmlFor="imei" className="text-right">
                IMEI / Serial
              </Label>
              <Input
                defaultValue={product?.imei}
                id="imei"
                name="imei"
                className="col-span-3"
              />
            </div>
            <div>
              <Label htmlFor="network" className="text-right">
                Network
              </Label>
              <Input
                defaultValue={product?.network}
                id="network"
                name="network"
                className="col-span-3"
              />
            </div>
            <div>
              <Label htmlFor="storage" className="text-right">
                Storage
              </Label>
              <Input
                defaultValue={product?.storage}
                id="storage"
                name="storage"
                className="col-span-3"
              />
            </div>
            <div>
              <Label htmlFor="batteryHealth" className="text-right">
                Battery Health
              </Label>
              <Input
                defaultValue={product?.batteryHealth}
                id="batteryHealth"
                name="batteryHealth"
                className="col-span-3"
              />
            </div>

            <div>
              <Label htmlFor="vendorId">Select Vendor</Label>
              <select
                name="vendorId"
                id="vendorId"
                defaultValue={product?.vendorId}
                className="w-full p-2 bg-background ring-1 ring-white rounded-md"
              >
                <option value="">Select Vendor</option>
                {vendors?.map((vendor: any) => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.name}
                  </option>
                ))}
              </select>
              {/* <AddVendorModal /> */}
            </div>
            <div>
              <Label htmlFor="categoryId">Select Category</Label>
              <select
                name="categoryId"
                id="categoryId"
                defaultValue={product?.categoryId}
                className="w-full p-2 bg-background ring-1 ring-white rounded-md"
              >
                <option value="">Select Category</option>
                {categories?.map((category: any) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {/* <AddCategoryModal /> */}
            </div>

            <div className="relative h-[150px]">
              <UploadButton
                className="w-full mt-8 z-50"
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  setImage(res[0]?.url);
                  console.log("Files: ", res);
                }}
                onUploadError={(error: Error) => {
                  console.log(error.message);
                }}
              />
              {image ? (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -z-10 w-full brightness-75">
                  <Image
                    src={image}
                    alt="Image"
                    width={1000}
                    height={1000}
                    className="w-full h-[150px] object-cover rounded-md"
                  />
                </div>
              ) : (
                product?.image && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -z-10 w-full brightness-75">
                    <Image
                      src={product.image}
                      alt="Image"
                      width={1000}
                      height={1000}
                      className="w-full h-[150px] object-cover rounded-md"
                    />
                  </div>
                )
              )}
            </div>

            <div>
              <Label htmlFor="tags" className="text-right">
                Tags
              </Label>
              <Input
                defaultValue={product?.tags}
                id="tags"
                name="tags"
                className="col-span-3"
              />
            </div>
            <div>
              <Label htmlFor="price" className="text-right">
                Price
              </Label>
              <Input
                type="number"
                id="price"
                name="price"
                defaultValue={product?.price}
                className="col-span-3"
              />
            </div>
            <div>
              <Label htmlFor="minimumPrice" className="text-right">
                Minimum Price
              </Label>
              <Input
                type="number"
                id="minimumPrice"
                name="minimumPrice"
                defaultValue={product?.minimumPrice}
                className="col-span-3"
              />
            </div>
            <div>
              <Label htmlFor="cost" className="text-right">
                Cost
              </Label>
              <Input
                type="number"
                id="cost"
                name="cost"
                defaultValue={product?.cost}
                className="col-span-3"
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <select
                name="status"
                id="status"
                defaultValue={product?.status}
                className="w-full p-2 bg-background ring-1 ring-white rounded-md"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
            <div>
              <Label htmlFor="condition">Condition</Label>
              <select
                name="condition"
                id="condition"
                defaultValue={product?.condition}
                className="w-full p-2 bg-background ring-1 ring-white rounded-md"
              >
                <option value="NEW">New</option>
                <option value="USED">Used</option>
              </select>
            </div>
            <div>
              <Label htmlFor="inStock" className="text-right">
                Stock
              </Label>
              <Input
                type="number"
                id="inStock"
                name="inStock"
                defaultValue={product?.inStock}
                className="col-span-3"
              />
            </div>
            {product && (
              <Input
                id="productId"
                name="productId"
                value={product?.id}
                type="hidden"
              />
            )}
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
