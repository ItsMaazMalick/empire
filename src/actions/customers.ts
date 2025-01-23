"use server";

import { prisma } from "@/lib/prisma";
import { ActionResponse } from "@/types/repair-brand";
import { revalidatePath } from "next/cache";
import { getStoreFromSession } from "./session";

export async function createCustomer(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const store = await getStoreFromSession();

    if (!name || !phone || !store) {
      return {
        success: false,
        message: "Please fill all fields",
      };
    }

    await prisma.customer.create({
      data: {
        name,
        email,
        phone,
        storeId: store.id,
      },
    });
    revalidatePath(`/${store.id}/cart`);
    return {
      success: true,
      message: "Customer added successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Failed to add customer. Please try again.",
    };
  }
}

export async function getAllCustomers() {
  try {
    const customers = await prisma.customer.findMany();
    return customers;
  } catch (error) {
    return null;
  }
}
