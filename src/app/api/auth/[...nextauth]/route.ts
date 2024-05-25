import NextAuth from "next-auth";
import { cookies } from "next/headers";
import { type NextRequest, type NextResponse } from "next/server";

import { authOptions } from "~/server/auth";

const handler = async (req: NextRequest, res: NextResponse) => {
  const cookieJar = cookies(); // jam jam

  const figmaWriteKey = req.nextUrl.searchParams.get("figma-write-key");

  if (req.nextUrl.pathname.includes("/api/auth/signin") && figmaWriteKey) {
    cookieJar.set("figma-write-key", figmaWriteKey);
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
  return NextAuth(authOptions)(req, res);
};

export { handler as GET, handler as POST };
