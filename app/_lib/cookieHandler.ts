// server/cookieHandler.ts
"use server";
import { cookies } from "next/headers";

export const setCookie = async () => {
  const cookieStore = await cookies();
  await cookieStore.set("auth", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
};
