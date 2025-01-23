"use server";

import { prisma } from "@/lib/prisma";
import type { ActionResponse } from "@/types/repair-brand";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function loginUser(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return {
        success: false,
        message: "All fields are required",
      };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (!existingUser || !existingUser.password) {
      return {
        success: false,
        message: "Invalid credentials",
      };
    }

    const validPassword = await bcrypt.compare(password, existingUser.password);

    if (!validPassword) {
      return {
        success: false,
        message: "Invalid credentials",
      };
    }

    const tokenData = {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.role,
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    // Set cookie with proper expiration date
    const oneDay = 24 * 60 * 60 * 1000;
    const cookieStore = await cookies();
    cookieStore.set({
      name: "user",
      value: token,
      expires: new Date(Date.now() + oneDay),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return {
      success: true,
      message: "Login successful",
      id: existingUser.id,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "An error occurred during login. Please try again.",
    };
  }
}

export async function loginStore(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const userId = formData.get("userId") as string;
    const code = formData.get("code") as string;

    if (!userId || !code) {
      return {
        success: false,
        message: "All fields are required",
      };
    }

    const existingStore = await prisma.store.findUnique({
      where: { code },
    });
    if (!existingStore) {
      return {
        success: false,
        message: "Invalid credentials",
      };
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!existingUser) {
      return {
        success: false,
        message: "Invalid credentials",
      };
    }

    const isValidUser = existingUser.storeId.find(
      (store) => store === existingStore.id
    );
    if (!isValidUser) {
      return {
        success: false,
        message: "Invalid credentials",
      };
    }

    const tokenData = {
      id: existingStore.id,
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    // Set cookie with proper expiration date
    const oneDay = 24 * 60 * 60 * 1000;
    const cookieStore = await cookies();
    cookieStore.set({
      name: "store",
      value: token,
      expires: new Date(Date.now() + oneDay),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return {
      success: true,
      message: "Login successful",
      id: existingStore.id,
    };
  } catch (error) {
    console.error("Store login error:", error);
    return {
      success: false,
      message: "An error occurred during login. Please try again.",
    };
  }
}
