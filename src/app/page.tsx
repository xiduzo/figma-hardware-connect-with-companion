import { Icon, Text, Title } from "~/common/components";
import { getServerAuthSession } from "~/server/auth";
import { Navigation } from "./_components/Navigation";
import { ShowConections } from "./_components/connections";
import { SerialPortComponent } from "./_components/serialport";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <>
      <Navigation />

      <section className="flex space-x-4">
        <main className="flex-grow">
          <div className="mb-4 flex items-center space-x-2">
            <Icon icon="ExclamationTriangleIcon" />
            <Text>This is under active development</Text>
          </div>
          <SerialPortComponent userId={session?.user.id} />
        </main>

        <aside className="w-2/5">
          <Title>Figma variables</Title>
          {session && <ShowConections />}
          {!session && <Text>Sign in to sync</Text>}
        </aside>
      </section>
    </>
  );
}
