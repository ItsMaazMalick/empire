"use server";

import { prisma } from "@/lib/prisma";
import { Order } from "@/store";
import { ActionResponse } from "@/types/repair-brand";

import { revalidatePath } from "next/cache";

export async function createOrder(order: Order | null) {
  try {
    if (!order) {
      return {
        success: false,
        message: "Order is required",
      };
    }

    if (!order.orderServices) {
      return {
        success: false,
        message: "Order services are required",
      };
    }

    const newOrder = await prisma.order.create({
      data: {
        price: order?.price || 0,
        orderNotes: order?.orderNotes || "",
        tags: order?.tags || [],
        repairNotes: order?.repairNotes || "",
        userId: order?.userId || "",
        customerId: order?.customer?.id || "",
      },
    });

    const orderServices = await prisma.orderItem.createMany({
      data: order?.orderServices.map((service) => ({
        imei: service.imei || "",
        orderId: newOrder.id,
        orderServiceId: service.serviceId,
        dueDate: new Date(service.dueDate || "").toISOString(),
        password: service.password || "",
        quantity: service.quantity,
        repairStatus: service.status,
      })),
    });
    return {
      success: true,
      message: "Order created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to create order. Please try again.",
    };
  }
}

export async function getAllOrders() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        customer: true,
        orderItems: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    return orders;
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

export async function updateOrderItemStatus(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const id = formData.get("id") as string;
    const status = formData.get("status") as
      | "WAITING_FOR_PARTS"
      | "WORKING_ON_IT"
      | "PENDING"
      | "FIXED"
      | "PICKED_UP";
    const item = await prisma.orderItem.update({
      where: { id },
      data: {
        repairStatus: status,
      },
    });
    revalidatePath(`/123/orders/${id}`);
    return {
      success: true,
      message: "Status has been updated",
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}
