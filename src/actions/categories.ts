"use server";

import { prisma } from "@/lib/prisma";
import { ActionResponse } from "@/types/repair-brand";
import { revalidatePath } from "next/cache";
import { getStoreFromSession } from "./session";

export async function createCategory(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const name = formData.get("name") as string;
    const store = await getStoreFromSession();

    if (!name || !store) {
      return {
        success: false,
        message: "Please fill all fields",
      };
    }

    await prisma.category.create({
      data: {
        name,
        storeId: store.id,
      },
    });
    revalidatePath(`/${store.id}/products`);
    return {
      success: true,
      message: "Category added successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Failed to add customer. Please try again.",
    };
  }
}

export async function getAllCategories() {
  try {
    const categories = await prisma.category.findMany();
    return categories;
  } catch (error) {
    return null;
  }
}
