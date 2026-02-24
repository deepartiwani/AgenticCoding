import { NextRequest, NextResponse } from "next/server";
import { apiRoot } from "@/lib/commercetools";

export async function POST(req: NextRequest) {
  const { token, password } = await req.json();
  if (!token || !password) {
    return NextResponse.json({ error: "Token and password required" }, { status: 400 });
  }
  try {
    await apiRoot.customers().passwordReset().post({
      body: {
        tokenValue: token,
        newPassword: password,
      },
    }).execute();
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Reset failed";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
