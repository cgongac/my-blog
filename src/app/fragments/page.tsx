export const dynamic = "force-dynamic";

import { FragmentMasonry } from "@/components/fragment-masonry";
import { getAllFragments } from "@/lib/content";

export default async function FragmentsPage(): Promise<JSX.Element> {
  const entries = await getAllFragments();
  const publicEntries = entries.filter((e) => e.visibility === "public");

  return (
    <section>
       <FragmentMasonry items={publicEntries} />
    </section>
  );
}
