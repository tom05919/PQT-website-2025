import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="pqt-footer">
      <div className="pqt-container pqt-footer__grid">
        <div className="pqt-stack-6">
          <div className="pqt-footer__brand">
            <Image
              src="/images/logo-no-text.png"
              alt="Princeton Quantitative Traders logo"
              width={56}
              height={56}
            />
            <div>
              <h2>Princeton Quantitative Traders</h2>
              <p>Official Princeton University Quantitative Trading Club</p>
            </div>
          </div>
          <p className="pqt-footer__description">
            Fostering a community of students passionate about quantitative
            finance, research, and applied mathematics.
          </p>
        </div>

        <div className="pqt-stack">
          <span className="pqt-label">Quick links</span>
          <ul className="pqt-footer__links">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/past-events">Past Events</Link></li>
            <li><Link href="/sponsors">Sponsors</Link></li>
            <li><Link href="/join">Join Us</Link></li>
          </ul>
        </div>

        <div className="pqt-stack">
          <span className="pqt-label">Contact</span>
          <ul className="pqt-footer__links">
            <li><a href="mailto:pqt@princeton.edu">pqt@princeton.edu</a></li>
            <li>Campus Group: Princeton Quantitative Traders</li>
            <li>
              <a href="https://www.instagram.com/princetonquanttraders/">
                Instagram ↗
              </a>
            </li>
            <li>
              <a href="https://groupme.com/join_group/111159295/jL93cFqW">
                GroupMe ↗
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
