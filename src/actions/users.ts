"use server";

import { prisma } from "@/lib/prisma";
import { ActionResponse } from "@/types/repair-brand";
import { Role, Status } from "@prisma/client";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { getStoreFromSession } from "./session";
import { validateRequiredField } from "@/lib/required-field";

export async function createUser(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const store = await getStoreFromSession();
    const userData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      password: formData.get("password") as string,
      status: formData.get("status") as Status | null | undefined,
      role: formData.get("role") as Role | null | undefined,

      calculateCommition: formData.get("calculateCommition") as string,
      refundCommition: formData.get("refundCommition") as string,
      accessoriesPercentage: Number(formData.get("accessoriesPercentage")),
      electronicsPercentage: Number(formData.get("electronicsPercentage")),
      serviceProductsPercentage: Number(
        formData.get("serviceProductsPercentage")
      ),
      repairsPercentage: Number(formData.get("repairsPercentage")),
    };

    const requiredFields = [
      { name: "name", value: userData.name },
      { name: "email", value: userData.email },
      // { name: "phone", value: userData.phone },
      { name: "password", value: userData.password },
      // { name: "status", value: userData.status },
      // { name: "role", value: userData.role },
    ];

    for (const { name, value } of requiredFields) {
      if (!validateRequiredField(name, value)) {
        return {
          success: false,
          message: "Missing some required fields",
        };
      }
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: userData.email,
      },
    });

    if (existingUser) {
      return {
        success: false,
        message: "User already exists",
      };
    }
    let hashedPassword = "";
    if (userData.password) {
      hashedPassword = await bcrypt.hash(userData.password, 10);
    } else {
      hashedPassword = await bcrypt.hash(userData.email, 10);
    }

    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,

        password: hashedPassword,
        status: userData.status ?? "INACTIVE",
        role: userData.role ?? "MANAGER",
        calculateCommition:
          userData.calculateCommition === "sales" ? "sales" : "profit",
        refundCommition: userData.refundCommition === "yes" ? true : false,
        accessoriesPercentage: userData.accessoriesPercentage,
        electronicsPercentage: userData.electronicsPercentage,
        serviceProductsPercentage: userData.serviceProductsPercentage,
        repairsPercentage: userData.repairsPercentage,
      },
    });

    if (store) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          stores: {
            connect: {
              id: store.id,
            },
          },
        },
      });
    }

    revalidatePath(`/${store?.id}/settings/users`);
    return {
      success: true,
      message: "user added successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to add user. Please try again.",
    };
  }
}
export async function updateUser(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const store = await getStoreFromSession();
    const userData = {
      id: formData.get("id") as string,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      status: formData.get("status") as Status,
      role: formData.get("role") as Role,
      calculateCommition: formData.get("calculateCommition") as string,
      refundCommition: formData.get("refundCommition") as string,
      accessoriesPercentage: Number(formData.get("accessoriesPercentage")),
      electronicsPercentage: Number(formData.get("electronicsPercentage")),
      serviceProductsPercentage: Number(
        formData.get("serviceProductsPercentage")
      ),
      repairsPercentage: Number(formData.get("repairsPercentage")),
    };
    const existingUser = await prisma.user.findUnique({
      where: {
        id: userData.id,
      },
    });

    if (!existingUser || !store) {
      return {
        success: false,
        message: "User not found",
      };
    }

    await prisma.user.update({
      where: {
        id: userData.id,
      },
      data: {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,

        status: userData.status,
        role: userData.role,
        calculateCommition:
          userData.calculateCommition === "sales" ? "sales" : "profit",
        refundCommition: userData.refundCommition === "yes" ? true : false,
        accessoriesPercentage: userData.accessoriesPercentage,
        electronicsPercentage: userData.electronicsPercentage,
        serviceProductsPercentage: userData.serviceProductsPercentage,
        repairsPercentage: userData.repairsPercentage,
        stores: {
          connect: {
            id: store.id,
          },
        },
      },
    });
    revalidatePath(`/${store.id}/settings/users`);
    return {
      success: true,
      message: "user updated successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Failed to update user. Please try again.",
    };
  }
}

export async function getUsers() {
  try {
    const store = await getStoreFromSession();
    if (!store) {
      return null;
    }
    const users = await prisma.user.findMany({
      where: {
        stores: {
          some: {
            id: store.id,
          },
        },
      },
    });
    return users;
  } catch (error) {
    return null;
  }
}
