import { currentUser } from "@clerk/nextjs/server";
import { findUser, upsertAppearance } from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress;
    if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await findUser("email", email);
    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const body = await req.json();
    const { 
      theme, bg_color, bg_gradient, bg_image, button_style, button_shape, 
      font, text_color, link_color
    } = body;

    await upsertAppearance(dbUser.id, {
      theme: theme || "minimal",
      bg_color: bg_color || null,
      bg_gradient: bg_gradient || null,
      bg_image: bg_image || null,
      button_style: button_style || "filled",
      button_shape: button_shape || "rounded",
      font: font || "inter",
      text_color: text_color || null,
      link_color: link_color || null,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Appearance save error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
