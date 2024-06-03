import Link from "next/link";

import { Button } from "~/common/components";
import { getServerAuthSession } from "~/server/auth";

export async function Navigation() {
  const session = await getServerAuthSession();

  return (
    <nav className="mb-6 flex justify-end">
      <Link href={session ? "/api/auth/signout" : "/api/auth/signin"}>
        <Button icon="UserCircleIcon">
          {session ? session.user.name : "Sign in"}
        </Button>
      </Link>
    </nav>
  );
}
