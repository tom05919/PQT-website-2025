import type { Metadata } from "next";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import { clubLinks, goldSponsors, silverSponsors } from "@/data/site";

export const metadata: Metadata = {
  title: "Sponsors",
  description:
    "The industry partners supporting Princeton Quantitative Traders and its student programs.",
};

export default function SponsorsPage() {
  return (
    <main id="main-content">
      <header className="pqt-page-head">
        <div className="pqt-container pqt-page-head__grid">
          <p className="pqt-label pqt-label--orange">Industry partners</p>
          <Reveal>
            <h1>Sponsors</h1>
            <p>
              Our partners help Princeton students learn from practitioners,
              build projects, and take part in trading competitions.
            </p>
          </Reveal>
        </div>
      </header>

      <section className="pqt-section">
        <div className="pqt-container">
          <Reveal className="pqt-sponsor-tier">
            <div className="pqt-sponsor-tier__heading">
              <p className="pqt-label">Gold partners</p>
              <span>{String(goldSponsors.length).padStart(2, "0")}</span>
            </div>
            <div className="pqt-logo-wall">
              {goldSponsors.map((sponsor) => (
                <article className="pqt-logo-cell" key={sponsor.name}>
                  <Image
                    src={sponsor.logo}
                    alt={`${sponsor.name} logo`}
                    width={240}
                    height={72}
                  />
                  <p>{sponsor.name}</p>
                </article>
              ))}
            </div>
          </Reveal>

          <Reveal className="pqt-sponsor-tier" delay={0.08}>
            <div className="pqt-sponsor-tier__heading">
              <p className="pqt-label">Silver partners</p>
              <span>{String(silverSponsors.length).padStart(2, "0")}</span>
            </div>
            <div className="pqt-logo-wall pqt-logo-wall--silver">
              {silverSponsors.map((sponsor) => (
                <article className="pqt-logo-cell" key={sponsor.name}>
                  <Image
                    src={sponsor.logo}
                    alt={`${sponsor.name} logo`}
                    width={240}
                    height={72}
                  />
                  <p>{sponsor.name}</p>
                </article>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pqt-section pqt-section--soft">
        <div className="pqt-container pqt-partner-grid">
          <p className="pqt-label">Work with PQT</p>
          <Reveal>
            <h2>Sponsorship opportunities</h2>
            <p>
              Read the sponsorship package or contact the team to discuss
              workshops, competitions, and student programming.
            </p>
            <div className="pqt-actions">
              <a className="pqt-btn pqt-btn--dark" href={clubLinks.sponsorshipPackage}>
                Sponsorship package <span aria-hidden="true">↗</span>
              </a>
              <a className="pqt-text-link" href={clubLinks.email}>
                {clubLinks.emailLabel} <span aria-hidden="true">→</span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
