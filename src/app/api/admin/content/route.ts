import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { getContent, updateContent } from "@/lib/data/store";

export async function GET() {
  const content = await getContent();
  return NextResponse.json(content);
}

export async function PUT(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const content = await updateContent(body);
  return NextResponse.json(content);
}
