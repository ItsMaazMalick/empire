"use server";

import { prisma } from "@/lib/prisma";
import { ActionResponse } from "@/types/repair-brand";

export async function createStore(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const name = formData.get("name") as string;
    const code = formData.get("code") as string;
    const userId = formData.get("userId") as string;

    const existingStore = await prisma.store.findUnique({
      where: { code },
    });
    if (existingStore) {
      return {
        success: false,
        message: "Store already exists",
      };
    }

    const store = await prisma.store.create({
      data: {
        name,
        code,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    // await prisma.user.update({
    //   where: { id: userId },
    //   data: {
    //     stores: {
    //       connect: {
    //         id: store.id,
    //       },
    //     },
    //   },
    // });

    return {
      success: true,
      message: "Store created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}

export async function getAllStoresByUserId(userId: string) {
  try {
    const stores = await prisma.store.findMany({
      where: {
        user: {
          some: {
            id: userId,
          },
        },
      },
    });
    return stores;
  } catch (error) {
    return null;
  }
}
