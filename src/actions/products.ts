"use server";

import { session } from "@/constants/data";
import { prisma } from "@/lib/prisma";
import { Order } from "@/store";
import { ActionResponse } from "@/types/repair-brand";
import { revalidatePath } from "next/cache";

export async function createProduct(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const title = formData.get("title") as string;
    const categoryId = formData.get("categoryId") as string;
    const vendorId = formData.get("vendorId") as string;
    const description = formData.get("description") as string;
    const tags = formData.get("tags") as string;
    const image = formData.get("image") as string;
    const price = Number(formData.get("price"));
    const minimumPrice = Number(formData.get("minimumPrice"));
    const cost = Number(formData.get("cost"));
    const status = formData.get("status") as "ACTIVE" | "INACTIVE";
    const condition = formData.get("condition") as string;
    const inStock = Number(formData.get("inStock"));

    if (!title) {
      return {
        success: false,
        message: "All fields are required",
      };
    }

    await prisma.product.create({
      data: {
        title,

        description,
        tags,
        image,
        price,
        minimumPrice,
        cost,
        status,
        condition,
        inStock,
        categoryId,
        vendorId,
      },
    });
    revalidatePath(`/${session.user.storeId}/products`);
    return {
      success: true,
      message: "Product added successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to add brand. Please try again.",
    };
  }
}

export async function updateProduct(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const productId = formData.get("productId") as string;
    const title = formData.get("title") as string;
    const categoryId = formData.get("categoryId") as string;
    const vendorId = formData.get("vendorId") as string;
    const description = formData.get("description") as string;
    const tags = formData.get("tags") as string;
    const image = formData.get("image") as string;
    const price = Number(formData.get("price"));
    const minimumPrice = Number(formData.get("minimumPrice"));
    const cost = Number(formData.get("cost"));
    const status = formData.get("status") as "ACTIVE" | "INACTIVE";
    const condition = formData.get("condition") as string;
    const inStock = Number(formData.get("inStock"));

    if (!productId) {
      return {
        success: false,
        message: "All fields are required",
      };
    }

    await prisma.product.update({
      where: { id: productId },
      data: {
        title,

        description,
        tags,
        image,
        price,
        minimumPrice,
        cost,
        status,
        condition,
        inStock,
        categoryId,
        vendorId,
      },
    });
    revalidatePath(`/${session.user.storeId}/products`);
    return {
      success: true,
      message: "Product updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to update product. Please try again.",
    };
  }
}

export async function getAllProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        vendor: true,
      },
    });
    return products;
  } catch (error) {
    return null;
  }
}

export async function getOrderById(id: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        user: true,
        orderItems: {
          include: {
            orderService: {
              include: {
                repairServiceType: {
                  include: {
                    repairModel: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    return order;
  } catch (error) {
    return null;
  }
}

export async function deleteProduct(id: string) {
  try {
    // First, delete all related OrderProduct entries
    await prisma.orderProduct.deleteMany({
      where: { orderProductId: id },
    });
    await prisma.product.delete({
      where: { id },
    });
    revalidatePath("/123/products");
    return {
      success: true,
      message: "Product deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to delete product",
      error,
    };
  }
}
