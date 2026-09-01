"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/past-events", label: "Past Events" },
  { href: "/sponsors", label: "Sponsors" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <header className="pqt-site-header">
      <nav className="pqt-container pqt-nav" aria-label="Primary navigation">
        <Link
          className="pqt-nav__brand"
          href="/"
          aria-label="Princeton Quantitative Traders home"
        >
          <Image
            src="/images/logo-no-text.png"
            alt=""
            width={28}
            height={28}
            priority
          />
          <span>Princeton Quantitative Traders</span>
        </Link>
        <div className="pqt-nav__links">
          {links.map((link) => (
            <Link
              className="pqt-nav__link"
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
          <Link
            className="pqt-btn pqt-btn--solid"
            href="/join"
            aria-current={pathname === "/join" ? "page" : undefined}
          >
            Join
          </Link>
        </div>
      </nav>
    </header>
  );
}
