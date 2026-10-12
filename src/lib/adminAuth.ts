import { NextRequest } from "next/server";

export function verifyAdminAccess(req: NextRequest): {
  authorized: boolean;
  adminEmail: string;
} {
  const adminKey = req.headers.get("x-admin-key");
  const authHeader = req.headers.get("authorization");
  const cookieToken = req.cookies.get("admin_session")?.value;
  const queryKey = req.nextUrl.searchParams.get("key");

  const expectedPass = process.env.ADMIN_ACCESS_PASSWORD || "corbett2026admin";

  // Check header, cookie, or query param
  if (
    adminKey === expectedPass ||
    authHeader === `Bearer ${expectedPass}` ||
    cookieToken === expectedPass ||
    queryKey === expectedPass
  ) {
    const adminEmail =
      req.headers.get("x-admin-email") ||
      req.nextUrl.searchParams.get("email") ||
      "admin@priyaljustin.com";
    return { authorized: true, adminEmail };
  }

  return { authorized: false, adminEmail: "" };
}
