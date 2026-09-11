import { findUser } from "@/models/user";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { emailAddresses } = await currentUser();
    const email = emailAddresses[0].emailAddress;
    const data = await findUser("email", email);
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
