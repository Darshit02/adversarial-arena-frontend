import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublic = createRouteMatcher([
  "/",
  "/pricing",
  "/docs",
  "/blog(.*)",
  "/login(.*)",
  "/signup(.*)",
  "/forgot-password",
  "/dev/components",
  "/dev/health",
]);

const isAppRoute = createRouteMatcher([
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
  if (isAppRoute(req)) {
    await auth.protect();
  }

  // Redirect signed-in users away from /login and /signup
  const { userId } = await auth();
  const { pathname } = req.nextUrl;
  if (userId && (pathname === "/login" || pathname === "/signup")) {
    return Response.redirect(new URL("/dashboard", req.url));
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
