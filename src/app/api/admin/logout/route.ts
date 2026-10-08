import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { clearedCookie } from "@/lib/auth";

export async function POST() {
  (await cookies()).set(clearedCookie());
  return NextResponse.json({ ok: true });
}
