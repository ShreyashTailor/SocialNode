import { findUser } from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { username } = await req.json();
    const data = await findUser("username", username);
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
