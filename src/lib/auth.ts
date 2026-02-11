import crypto from "crypto";

import { cookies } from "next/headers";

export const PRIVATE_COOKIE_NAME = "blog_private_unlocked";
export const PRIVATE_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export function getPrivatePassword(): string | null {
  const password = process.env.BLOG_PRIVATE_PASSWORD;

  if (!password || password.trim().length === 0) {
    return null;
  }

  return password;
}

export function hasPrivateAccess(): boolean {
  return cookies().get(PRIVATE_COOKIE_NAME)?.value === "1";
}

function sha256(value: string): Buffer {
  return crypto.createHash("sha256").update(value, "utf8").digest();
}

export function verifyPassword(input: string, expected: string): boolean {
  const inputHash = sha256(input);
  const expectedHash = sha256(expected);

  return crypto.timingSafeEqual(inputHash, expectedHash);
}

export function buildUnlockUrl(nextPath: string): string {
  const safePath = nextPath.startsWith("/") ? nextPath : "/";
  return `/unlock?next=${encodeURIComponent(safePath)}`;
}
