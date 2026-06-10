import { NextResponse } from "next/server";
import { saveUpload } from "@/lib/store";
import { isAuthorized } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }
    const gh = {
      token: req.headers.get("x-github-token") || "",
      repo: req.headers.get("x-github-repo") || "",
      branch: req.headers.get("x-github-branch") || "",
    };
    const url = await saveUpload(file, gh);
    return NextResponse.json({ url });
  } catch (e) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
