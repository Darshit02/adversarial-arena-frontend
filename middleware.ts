import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isApp = createRouteMatcher([
  "/app(.*)",
  "/dashboard(.*)",
  "/attack-lab(.*)",
  "/runs(.*)",
  "/validators(.*)",
  "/models(.*)",
  "/settings(.*)",
  "/onboarding(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Protect authenticated application routes
  if (isApp(req)) {
    await auth.protect();
  }

  // Signed-in users visiting /login or /signup get redirected to /dashboard
  const { userId } = await auth();
  const { pathname } = req.nextUrl;
  if (userId && (pathname === "/login" || pathname === "/signup")) {
    return Response.redirect(new URL("/dashboard", req.url));
  }
});

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
