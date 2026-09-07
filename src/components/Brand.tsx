import Link from "next/link";

type BrandProps = {
  compact?: boolean;
};

export default function Brand({ compact = false }: BrandProps) {
  return (
    <Link
      className={`pqt-brand${compact ? " pqt-brand--compact" : ""}`}
      href="/"
      aria-label="Princeton Quantitative Traders home"
    >
      <span className="pqt-brand__mark" aria-hidden="true">
        PQT
      </span>
      <span className="pqt-brand__name">
        <span>Princeton</span>
        <span>Quantitative Traders</span>
      </span>
    </Link>
  );
}
