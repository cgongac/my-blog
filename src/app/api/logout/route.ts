import { NextResponse } from "next/server";

import { PRIVATE_COOKIE_NAME } from "@/lib/auth";

export async function POST(): Promise<Response> {
  const response = NextResponse.json({ ok: true });

  response.cookies.set({
    name: PRIVATE_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });

  return response;
}
