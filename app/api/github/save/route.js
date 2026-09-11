import { currentUser } from "@clerk/nextjs/server";
import { findUser, updateGithubFeatured } from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress;
    if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await findUser("email", email);
    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { featured } = await req.json();
    if (!Array.isArray(featured)) return NextResponse.json({ error: "featured array required" }, { status: 400 });

    await updateGithubFeatured(dbUser.id, featured);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
