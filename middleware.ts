import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Get the user's role from the token
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Allow access to admin login page
    if (pathname === "/admin/login") {
      // If user is already logged in and is admin, redirect to dashboard
      if (token?.role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }
      return NextResponse.next();
    }

    // Protect admin routes
    if (pathname.startsWith("/admin")) {
      // If no token, redirect to login
      if (!token) {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }

      // If not admin, deny access
      if (token.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Allow public routes
        if (!pathname.startsWith("/admin")) {
          return true;
        }

        // Allow admin login page
        if (pathname === "/admin/login") {
          return true;
        }

        // For admin routes, require admin role
        return token?.role === "ADMIN";
      },
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*"
  ]
};
