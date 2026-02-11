import { NextResponse } from "next/server";
import { z } from "zod";

import { getPrivatePassword, PRIVATE_COOKIE_MAX_AGE, PRIVATE_COOKIE_NAME, verifyPassword } from "@/lib/auth";

const payloadSchema = z.object({
  password: z.string().min(1)
});

export async function POST(request: Request): Promise<Response> {
  const body = await request.json().catch(() => null);
  const parsed = payloadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "请求参数不合法" }, { status: 400 });
  }

  const expectedPassword = getPrivatePassword();

  if (!expectedPassword) {
    return NextResponse.json({ message: "服务端尚未配置 BLOG_PRIVATE_PASSWORD" }, { status: 500 });
  }

  const isValid = verifyPassword(parsed.data.password, expectedPassword);

  if (!isValid) {
    return NextResponse.json({ message: "密码错误" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: PRIVATE_COOKIE_NAME,
    value: "1",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: PRIVATE_COOKIE_MAX_AGE
  });

  return response;
}
