import { currentUser } from "@clerk/nextjs/server";
import { findUser, updateCustomLink } from "@/models/user";
import { NextResponse } from "next/server";

export async function PATCH(req) {
  try {
    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress;
    if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await findUser("email", email);
    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ error: "Link ID required" }, { status: 400 });

    // Validate URL if provided
    if (updates.url) {
      try { new URL(updates.url); } catch { return NextResponse.json({ error: "Invalid URL" }, { status: 400 }); }
    }

    await updateCustomLink(id, dbUser.id, updates);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
