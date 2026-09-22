// Next.js 16 renamed the `middleware` file convention to `proxy`. This file must
// be the only one — having both middleware.js and proxy.ts in the project is a
// build error. Proxy always runs on the Node.js runtime, so route segment
// config (e.g. `export const runtime`) is not allowed here.
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/:username",
  "/api/page/get",
  "/api/analytics/track",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
