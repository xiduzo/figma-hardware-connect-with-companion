import { Icon, Text } from "~/common/components";
import { getServerAuthSession } from "~/server/auth";
import { FigmaVariables } from "./_components/FigmaVariables";
import { Navigation } from "./_components/Navigation";
import { SerialPortComponent } from "./_components/serialport";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <>
      <Navigation />

      <section className="flex flex-grow space-x-4">
        <main className="flex w-8/12 flex-col">
          <div className="mb-4 flex items-center space-x-2">
            <Icon icon="ExclamationTriangleIcon" />
            <Text>This is under active development</Text>
          </div>
          <SerialPortComponent userId={session?.user.id} />
        </main>

        <aside className="w-4/12">
          {session && <FigmaVariables />}
          {!session && <Text>Sign in to sync with figma</Text>}
        </aside>
      </section>
    </>
  );
}
