"use server";

import { session } from "@/constants/data";
import { prisma } from "@/lib/prisma";
import { ActionResponse } from "@/types/repair-brand";
import { revalidatePath } from "next/cache";

export async function createCategory(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const name = formData.get("name") as string;

    if (!name) {
      return {
        success: false,
        message: "Please fill all fields",
      };
    }

    await prisma.category.create({
      data: {
        name,
      },
    });
    revalidatePath(`/${session.user.storeId}/products`);
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
