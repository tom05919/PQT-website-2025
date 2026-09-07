import Link from "next/link";
import Brand from "@/components/Brand";
import { clubLinks } from "@/data/site";

export default function Footer() {
  return (
    <footer className="pqt-footer">
      <div className="pqt-container pqt-footer__grid">
        <div className="pqt-footer__intro">
          <Brand compact />
          <p className="pqt-footer__description">
            Princeton&apos;s student community for quantitative finance, market
            structure, and trading.
          </p>
        </div>

        <div>
          <p className="pqt-label">Explore</p>
          <ul className="pqt-footer__links">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/past-events">Past Events</Link></li>
            <li><Link href="/sponsors">Sponsors</Link></li>
            <li><Link href="/join">Join</Link></li>
          </ul>
        </div>

        <div>
          <p className="pqt-label">Contact</p>
          <ul className="pqt-footer__links">
            <li><a href={clubLinks.email}>{clubLinks.emailLabel}</a></li>
            <li>
              <a href={clubLinks.instagram} target="_blank" rel="noreferrer">
                Instagram ↗
              </a>
            </li>
            <li>
              <a href={clubLinks.groupMe} target="_blank" rel="noreferrer">
                GroupMe ↗
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="pqt-container pqt-footer__base">
        <p>Princeton University · Princeton, New Jersey</p>
        <p>Princeton Quantitative Traders</p>
      </div>
    </footer>
  );
}
