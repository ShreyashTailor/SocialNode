import { getCurrentDbUser } from "@/lib/security";

export async function GET() {
  try {
    const data = await getCurrentDbUser();
    if (!data) return Response.json({ data: null }, { status: 200 });
    const { accessKey: _accessKey, ...safeData } = data;
    return Response.json({ data: safeData }, { status: 200, headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return Response.json({ error: "Unable to load profile." }, { status: 500 });
  }
}
