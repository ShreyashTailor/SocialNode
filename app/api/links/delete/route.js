import { currentUser } from "@clerk/nextjs/server";
import { findUser, deleteCustomLink } from "@/models/user";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  try {
    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress;
    if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await findUser("email", email);
    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Link ID required" }, { status: 400 });

    await deleteCustomLink(id, dbUser.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
