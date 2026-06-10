import { NextResponse } from "next/server";
import { getContent, saveContent } from "@/lib/store";
import { isAuthorized } from "@/lib/auth";

export const dynamic = "force-dynamic";

function ghFromReq(req: Request) {
  return {
    token: req.headers.get("x-github-token") || "",
    repo: req.headers.get("x-github-repo") || "",
    branch: req.headers.get("x-github-branch") || "",
  };
}

export async function GET() {
  const content = await getContent();
  return NextResponse.json(content);
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // Login check — verify password only, don't save.
  if (req.headers.get("x-admin-check")) {
    return NextResponse.json({ ok: true });
  }
  try {
    const body = await req.json();
    const mode = await saveContent(body, ghFromReq(req));
    return NextResponse.json({ ok: true, mode });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Invalid content" }, { status: 400 });
  }
}
