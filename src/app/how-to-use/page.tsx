import { Navigation } from "../_components/Navigation";
import { Content } from "./_components/Content";

export default function Page() {
  return (
    <>
      <Navigation />
      <main className="space-y-2">
        <Content />
      </main>
    </>
  );
}
