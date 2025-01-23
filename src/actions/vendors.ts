"use server";

import { prisma } from "@/lib/prisma";
import { ActionResponse } from "@/types/repair-brand";
import { revalidatePath } from "next/cache";
import { getStoreFromSession } from "./session";

export async function createVendor(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const name = formData.get("name") as string;
    const address = formData.get("address") as string;
    const website = formData.get("website") as string;
    const phone = formData.get("phone") as string;
    const store = await getStoreFromSession();

    if (!name || !phone || !address || !store) {
      return {
        success: false,
        message: "Please fill all fields",
      };
    }

    await prisma.vendor.create({
      data: {
        name,
        address,
        website,
        phone,
        storeId: store.id,
      },
    });
    revalidatePath(`/${store.id}/products`);
    return {
      success: true,
      message: "Vendor added successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Failed to add vendor. Please try again.",
    };
  }
}

export async function getAllVendors() {
  try {
    const vendors = await prisma.vendor.findMany();
    return vendors;
  } catch (error) {
    return null;
  }
}
