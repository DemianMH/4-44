import { connection, NextResponse } from "next/server";
import { adminPassword, isAdmin } from "@/lib/auth";

export async function GET() {
  await connection(); // siempre dinámico: depende de la cookie de sesión
  return NextResponse.json({ configured: !!adminPassword(), authenticated: await isAdmin() });
}
