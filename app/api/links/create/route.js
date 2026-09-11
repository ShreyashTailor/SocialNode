import { currentUser } from "@clerk/nextjs/server";
import { findUser, createCustomLink } from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress;
    if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await findUser("email", email);
    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const body = await req.json();
    const { title, url, description, icon, scheduled, start_at, end_at, sort_order } = body;

    if (!title?.trim()) return NextResponse.json({ error: "Title required" }, { status: 400 });
    if (!url?.trim()) return NextResponse.json({ error: "URL required" }, { status: 400 });
    try { new URL(url); } catch { return NextResponse.json({ error: "Invalid URL" }, { status: 400 }); }

    const id = await createCustomLink({
      user_id: dbUser.id,
      title: title.trim(),
      url: url.trim(),
      description: description || null,
      icon: icon || "link",
      enabled: 1,
      sort_order: sort_order ?? 0,
      scheduled: scheduled ? 1 : 0,
      start_at: start_at ?? null,
      end_at: end_at ?? null,
    });

    return NextResponse.json({ id }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
