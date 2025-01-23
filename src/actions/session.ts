"use server";

import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function getUserFromSession() {
  try {
    const cookieStore = await await cookies();
    const userToken = cookieStore.get("user")?.value;
    if (!userToken) {
      return null;
    }
    const decryptToken = jwt.verify(
      userToken,
      process.env.JWT_SECRET!
    ) as JwtPayload;
    const user = {
      id: decryptToken.id,
      name: decryptToken.name,
      email: decryptToken.email,
      role: decryptToken.role,
    };
    return user;
  } catch (error) {
    return null;
  }
}

export async function getStoreFromSession() {
  try {
    const cookieStore = await await cookies();
    const storeToken = cookieStore.get("store")?.value;
    if (!storeToken) {
      return null;
    }
    const decryptToken = jwt.verify(
      storeToken,
      process.env.JWT_SECRET!
    ) as JwtPayload;
    const store = { id: decryptToken.id };
    return store;
  } catch (error) {
    return null;
  }
}
