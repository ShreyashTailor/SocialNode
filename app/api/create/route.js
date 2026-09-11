import { findUser, createUser, updateUser } from "@/models/user";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { emailAddresses, imageUrl } = await currentUser();
    const email = emailAddresses[0].emailAddress;

    const body = await request.json();
    const {
      name,
      username,
      bio,
      youtube,
      insta,
      instagram,
      face,
      facebook,
      twitter,
      linkedin,
      snapchat,
      github,
      threads,
      reddit,
      stackoverflow,
      leetcode,
      codeforces,
      hackerrank,
      codechef,
      geeksForGeeks,
      twitch,
      soundcloud,
      spotify,
      applemusic,
      discord,
      telegram,
      whatsapp,
      skype,
      amazon,
      shopify,
      kofi,
      buyMeACoffee,
      patreon,
      website,
      blog,
      phone,
      accessKey,
    } = body;

    // Validate
    if (!username || username.length < 3) {
      return NextResponse.json({ error: "Username must be at least 3 characters." }, { status: 400 });
    }
    if (!/^[a-z0-9_-]+$/.test(username)) {
      return NextResponse.json({ error: "Username can only contain lowercase letters, numbers, - and _." }, { status: 400 });
    }
    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }

    const existingByEmail = await findUser("email", email);
    const existingByUsername = await findUser("username", username);

    // Username collision check
    if (existingByUsername && existingByUsername.email !== email) {
      return NextResponse.json({ error: "Username is already in use" }, { status: 400 });
    }

    const userData = {
      name: name.trim(),
      username: username.trim().toLowerCase(),
      bio: bio?.trim() || null,
      image: imageUrl,
      youtube: youtube || null,
      instagram: instagram || insta || null,
      facebook: facebook || face || null,
      twitter: twitter || null,
      linkedin: linkedin || null,
      snapchat: snapchat || null,
      github: github || null,
      threads: threads || null,
      reddit: reddit || null,
      stackoverflow: stackoverflow || null,
      leetcode: leetcode || null,
      codeforces: codeforces || null,
      hackerrank: hackerrank || null,
      codechef: codechef || null,
      geeksForGeeks: geeksForGeeks || null,
      twitch: twitch || null,
      soundcloud: soundcloud || null,
      spotify: spotify || null,
      applemusic: applemusic || null,
      discord: discord || null,
      telegram: telegram || null,
      whatsapp: whatsapp || null,
      skype: skype || null,
      amazon: amazon || null,
      shopify: shopify || null,
      kofi: kofi || null,
      buyMeACoffee: buyMeACoffee || null,
      patreon: patreon || null,
      website: website || null,
      blog: blog || null,
      phone: phone || null,
      accessKey: accessKey || "",
    };

    if (existingByEmail) {
      await updateUser(email, userData);
    } else {
      await createUser({ ...userData, email });
    }

    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
