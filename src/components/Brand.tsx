import Image from "next/image";
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
      <Image
        className="pqt-brand__mark"
        src="/images/logo-no-text.png"
        alt=""
        width={56}
        height={58}
        preload={!compact}
      />
      <span className="pqt-brand__name">
        <span>Princeton</span>
        <span>Quantitative Traders</span>
      </span>
    </Link>
  );
}
