import { UnlockForm } from "@/components/unlock-form";

function resolveNextPath(nextPath: string | string[] | undefined): string {
  if (typeof nextPath !== "string") {
    return "/diary";
  }

  if (!nextPath.startsWith("/")) {
    return "/diary";
  }

  return nextPath;
}

export default function UnlockPage({
  searchParams
}: {
  searchParams: { next?: string | string[] };
}): JSX.Element {
  const nextPath = resolveNextPath(searchParams.next);

  return (
    <section className="unlock-shell">
      <UnlockForm nextPath={nextPath} />
    </section>
  );
}
