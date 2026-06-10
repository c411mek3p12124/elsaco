import { NextResponse } from "next/server";
import { getContent, saveContent } from "@/lib/store";
import { isAuthorized } from "@/lib/auth";
import { githubEnabled } from "@/lib/github";

export const dynamic = "force-dynamic";

export async function GET() {
  const content = await getContent();
  return NextResponse.json(content);
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    await saveContent(body);
    return NextResponse.json({ ok: true, mode: githubEnabled() ? "github" : "local" });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Invalid content" }, { status: 400 });
  }
}
