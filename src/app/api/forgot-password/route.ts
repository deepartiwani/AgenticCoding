import { NextRequest, NextResponse } from "next/server";
import { apiRoot } from "@/lib/commercetools";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  // commercetools: trigger password reset email
  try {
    await apiRoot.customers().passwordToken().post({
      body: {
        email,
        ttlMinutes: 30, // token valid for 30 minutes
      },
    }).execute();
    // Always return success for privacy
    return NextResponse.json({ ok: true });
  } catch (e) {
    // Still return success for privacy
    return NextResponse.json({ ok: true });
  }
}
