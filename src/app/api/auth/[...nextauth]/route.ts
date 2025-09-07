import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

// Next.js 15 App Router compatible handler
const handler = NextAuth(authOptions)

// Export individual handlers for each HTTP method
export const GET = handler
export const POST = handler
export const PUT = handler
export const DELETE = handler
export const PATCH = handler
export const HEAD = handler
export const OPTIONS = handler
