"use server";

import { prisma } from "@/lib/prisma";
import { Order } from "@/store";
import { ActionResponse } from "@/types/repair-brand";
import { OrderStatus, Status } from "@prisma/client";

import { revalidatePath } from "next/cache";

export async function createOrder(order: Order | null) {
  console.log(order);
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

    const filteredOrderServices = order.orderServices.filter(
      (service) => service.type === "REPAIR"
    );
    const filteredOrderProducts = order.orderServices.filter(
      (product) => product.type === "PRODUCT"
    );

    if (filteredOrderServices.length > 0) {
      console.log("Hello 1");
      try {
        const orderServices = await prisma.orderItem.createMany({
          data: filteredOrderServices.map((service) => {
            if (!service.dueDate) {
              return {
                imei: service.imei || "",
                orderId: newOrder.id,
                orderServiceId: service.serviceId,

                password: service.password || "",
                quantity: service.quantity,
                repairStatus: service.status,
              };
            } else {
              return {
                imei: service.imei || "",
                orderId: newOrder.id,
                orderServiceId: service.serviceId,
                dueDate: new Date(service.dueDate).toISOString(),
                password: service.password || "",
                quantity: service.quantity,
                repairStatus: service.status,
              };
            }
          }),
        });

        // Decrement the quantity for each repair service
        await Promise.all(
          filteredOrderServices.map((service) =>
            prisma.repairService.update({
              where: { id: service.serviceId },
              data: { stock: { decrement: service.quantity } },
            })
          )
        );
      } catch (error) {
        console.log("Hello 2");
        console.log(error);
        await prisma.order.delete({ where: { id: newOrder.id } });
      }
    }

    if (filteredOrderProducts.length > 0) {
      try {
        const orderProducts = await prisma.orderProduct.createMany({
          data: filteredOrderProducts.map((product) => ({
            quantity: product.quantity,
            orderId: newOrder.id,
            orderProductId: product.serviceId,
          })),
        });
        console.log("Hello 3");
      } catch (error) {
        console.log("Hello 4");
        console.log(error);
        await prisma.order.delete({ where: { id: newOrder.id } });
      }
    }

    await Promise.all(
      filteredOrderProducts.map((product) =>
        prisma.product.update({
          where: { id: product.serviceId },
          data: { inStock: { decrement: product.quantity } },
        })
      )
    );

    return {
      success: true,
      message: "Order created successfully",
    };
  } catch (error) {
    console.log(error);
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
        orderProducts: true,
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
  console.log(id);
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
        orderProducts: {
          include: {
            orderProduct: true,
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

export async function getFinances() {
  try {
    // Calculate Net Sales
    const orders = await prisma.order.findMany({
      include: {
        orderItems: {
          include: {
            orderService: true,
          },
        },
        orderProducts: {
          include: {
            orderProduct: true,
          },
        },
      },
    });

    let netSales = 0;
    let totalCost = 0;

    // Calculate totals
    for (const order of orders) {
      netSales += order.price;

      // Calculate costs from repair services
      for (const item of order.orderItems) {
        totalCost += item.orderService.cost * item.quantity;
      }

      // Calculate costs from products
      for (const product of order.orderProducts) {
        totalCost += product.orderProduct.cost * product.quantity;
      }
    }

    // Calculate Gross Profit and Margin
    const grossProfit = netSales - totalCost;
    const grossMargin = netSales > 0 ? (grossProfit / netSales) * 100 : 0;

    // Get sales by type
    const productSales = orders.reduce(
      (acc, order) =>
        acc +
        order.orderProducts.reduce(
          (sum, product) => sum + product.orderProduct.price * product.quantity,
          0
        ),
      0
    );

    const repairSales = orders.reduce(
      (acc, order) =>
        acc +
        order.orderItems.reduce(
          (sum, item) => sum + item.orderService.price * item.quantity,
          0
        ),
      0
    );

    // Get sales by location
    const salesByLocation = await prisma.order.groupBy({
      by: ["userId"],
      _sum: {
        price: true,
      },
      where: {
        user: {
          stores: {
            some: {
              name: "Empire", // You might want to make this dynamic
            },
          },
        },
      },
    });

    return {
      success: true,
      data: {
        netSales,
        grossProfit,
        grossMargin,
        salesByType: {
          products: productSales,
          repairs: repairSales,
        },
        salesByLocation: salesByLocation.reduce(
          (acc, location) => ({
            ...acc,
            [location.userId]: location._sum.price || 0,
          }),
          {}
        ),
      },
    };
  } catch (error) {
    console.error("Failed to fetch metrics:", error);
    return { success: false, error: "Failed to fetch metrics" };
  }
}

export async function getTotalSalesToday() {
  try {
    // Get the start of today and end of today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Set to the beginning of today (midnight)

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // Set to the end of today (just before midnight)

    // Query to count orders updated today
    const orders = await prisma.order.count({
      where: {
        updatedAt: {
          gte: startOfDay, // Greater than or equal to the start of today
          lte: endOfDay, // Less than or equal to the end of today
        },
      },
    });

    return orders;
  } catch (error) {
    console.error("Error fetching total sales today:", error);
    throw new Error("Failed to fetch total sales today");
  }
}

export async function getTotalRepairsToday() {
  try {
    // Get the start of today and end of today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Set to the beginning of today (midnight)

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // Set to the end of today (just before midnight)

    // Query to count repair orders created or updated today
    const orders = await prisma.order.count({
      where: {
        AND: [
          {
            orderItems: {
              some: {},
            },
          },
          {
            updatedAt: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
        ],
      },
    });

    return orders;
  } catch (error) {
    console.error("Error fetching total repairs today:", error);
    throw new Error("Failed to fetch total repairs today");
  }
}

export async function getTotalWaitingToday() {
  try {
    // Get the start of today and end of today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Set to the beginning of today (midnight)

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // Set to the end of today (just before midnight)

    // Query to count orders updated today
    const orders = await prisma.order.count({
      where: {
        orderItems: {
          some: {
            updatedAt: {
              gte: startOfDay, // Greater than or equal to the start of today
              lte: endOfDay, // Less than or equal to the end of today
            },
          },
        },
      },
    });

    return orders;
  } catch (error) {
    console.error(error);
    return null;
  }
}
export async function getTotalOrdersToday() {
  try {
    // Get the start of today and end of today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Set to the beginning of today (midnight)

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // Set to the end of today (just before midnight)

    // Query to count orders updated today
    const orders = await prisma.order.count({
      where: {
        updatedAt: {
          gte: startOfDay, // Greater than or equal to the start of today
          lte: endOfDay, // Less than or equal to the end of today
        },
      },
    });

    return orders;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function updateOrderPaymentStatus(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const id = formData.get("id") as string;
    const status = formData.get("status") as OrderStatus;
    const item = await prisma.order.update({
      where: { id },
      data: {
        orderStatus: status,
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
