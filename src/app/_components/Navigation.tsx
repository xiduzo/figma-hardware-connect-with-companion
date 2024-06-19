import Link from "next/link";

import { Button, ButtonGroup, Text } from "~/common/components";
import { getServerAuthSession } from "~/server/auth";

export async function Navigation() {
  const session = await getServerAuthSession();

  return (
    <nav className="mb-6 flex justify-between">
      <Link href={session ? "/api/auth/signout" : "/api/auth/signin"}>
        <Button icon="UserCircleIcon">
          {session ? session.user.name : "Sign in"}
        </Button>
      </Link>
      <ButtonGroup className="flex">
        <Link href="/">
          <Text className="hover:underline">Serial connection</Text>
        </Link>
        <Text>/</Text>
        <Link href="/how-to-use">
          <Text className="hover:underline">How to use</Text>
        </Link>
      </ButtonGroup>
    </nav>
  );
}
