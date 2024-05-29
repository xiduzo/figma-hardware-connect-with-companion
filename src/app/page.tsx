import Link from "next/link";

import { getServerAuthSession } from "~/server/auth";
import { ShowConections } from "./_components/connections";
import { SerialPortComponent } from "./_components/serialport";
// import { api } from "~/trpc/server";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center space-y-4 bg-stone-100 p-4 dark:bg-stone-800">
      <Link
        href={session ? "/api/auth/signout" : "/api/auth/signin"}
        className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
      >
        {session ? "Sign out" : "Sign in"}
      </Link>

      {session && <ShowConections />}
      {session && <SerialPortComponent userId={session.user.id} />}
    </main>
  );
}

// async function CrudShowcase() {
//   const session = await getServerAuthSession();
//   if (!session?.user) return null;

//   const latestPost = await api.post.getLatest();

//   return (
//     <div className="w-full max-w-xs">
//       {latestPost ? (
//         <p className="truncate">Your most recent post: {latestPost.name}</p>
//       ) : (
//         <p>You have no posts yet.</p>
//       )}

//       <CreatePost />
//     </div>
//   );
// }
