import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const publicPaths = ["/"]; // Define public paths
  const token = request.cookies.get("token")?.value; // Get token from cookies

  if (publicPaths.includes(request.nextUrl.pathname)) {
    // Allow access to public paths
    return NextResponse.next();
  }

  if (!token) {
    // Redirect to the login page if token is missing
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname); // Optional: Add redirect parameter
    return NextResponse.redirect(loginUrl);
  }

  // Allow access if token is present
  return NextResponse.next();
}

// Apply middleware to all routes
export const config = {
  matcher: ["/", "/((?!api|_next|static).*)"], // Matches all routes except API and Next.js internal paths
};
