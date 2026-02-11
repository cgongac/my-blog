import Link from "next/link";

type TagChipProps = {
  label: string;
  href?: string;
  active?: boolean;
};

export function TagChip({ label, href, active = false }: TagChipProps): JSX.Element {
  const className = active ? "tag-chip tag-chip-active" : "tag-chip";

  if (href) {
    return (
      <Link href={href} className={className}>
        {label}
      </Link>
    );
  }

  return <span className={className}>{label}</span>;
}
