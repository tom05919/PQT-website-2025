"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Brand from "@/components/Brand";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/past-events", label: "Past Events" },
  { href: "/sponsors", label: "Sponsors" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="pqt-site-header">
      <nav className="pqt-container pqt-nav" aria-label="Primary navigation">
        <Brand />
        <button
          className="pqt-nav__toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="primary-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span>{menuOpen ? "Close" : "Menu"}</span>
          <span className="pqt-nav__toggle-lines" aria-hidden="true">
            <i />
            <i />
          </span>
        </button>
        <div
          className="pqt-nav__links"
          id="primary-menu"
          data-open={menuOpen ? "true" : "false"}
        >
          {links.map((link) => (
            <Link
              className="pqt-nav__link"
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
          <Link
            className="pqt-btn pqt-btn--orange"
            href="/join"
            aria-current={pathname === "/join" ? "page" : undefined}
            onClick={() => setMenuOpen(false)}
          >
            Join
          </Link>
        </div>
      </nav>
    </header>
  );
}
