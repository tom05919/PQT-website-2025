import Image from "next/image";

const goldSponsors = [
  {
    name: "Citadel",
    logo: "/images/citadel-logo.jpg",
    description:
      "A global leader in investment and risk management, empowering analytical minds to solve hard problems.",
  },
  {
    name: "Jane Street",
    logo: "/images/jane-street-logo.png",
    description:
      "A research-driven trading firm where curiosity and collaboration drive innovation.",
  },
  {
    name: "Hudson River Trading",
    logo: "/images/hrt-logo.svg",
    description:
      "Engineers and researchers united to build technology for the world's financial markets.",
  },
  {
    name: "Five Rings",
    logo: "/images/five-rings-logo.jpeg",
    description:
      "A team-first meritocracy built on innovation, curiosity, and rapid problem-solving.",
  },
  {
    name: "D.E. Shaw",
    logo: "/images/DEShaw-logo.jpg",
    description:
      "A global investment and technology firm driven by analytical rigor and open exploration of ideas.",
  },
];

export default function SponsorsPage() {
  return (
    <main>
      <header className="pqt-container pqt-page-head">
        <div className="pqt-page-head__body">
          <h1>Our Sponsors</h1>
          <p className="pqt-lead">
            We&apos;re deeply grateful to the organizations that fuel our mission.
          </p>
        </div>
      </header>

      <section className="pqt-container pqt-section">
        <div className="pqt-section-head">
          <div className="pqt-section-head__body">
            <h2>Gold Sponsors</h2>
            <p>
              Our premier partners whose collaboration powers everything we do.
            </p>
          </div>
        </div>
        <div className="pqt-sponsor-grid">
          {goldSponsors.map((sponsor) => (
            <article className="pqt-sponsor" key={sponsor.name}>
              <Image
                className="pqt-sponsor__logo"
                src={sponsor.logo}
                alt={`${sponsor.name} logo`}
                width={220}
                height={64}
              />
              <p className="pqt-sponsor__name">{sponsor.name}</p>
              <p className="pqt-sponsor__description">
                {sponsor.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="pqt-container pqt-section">
        <div className="pqt-section-head">
          <div className="pqt-section-head__body">
            <h2>Silver Sponsors</h2>
            <p>Our valued partners supporting our growth and initiatives.</p>
          </div>
        </div>
        <div className="pqt-sponsor-grid">
          <article className="pqt-sponsor pqt-sponsor--silver">
            <Image
              className="pqt-sponsor__logo"
              src="/images/tower-logo.svg"
              alt="Tower Research logo"
              width={220}
              height={64}
            />
            <p className="pqt-sponsor__name">Tower Research</p>
            <p className="pqt-sponsor__description">
              Tower is a technology-driven trading firm where teams innovate
              and compete on the world&apos;s markets.
            </p>
          </article>
        </div>
      </section>

      <section className="pqt-container pqt-section">
        <div className="pqt-longform">
          <div className="pqt-longform__body">
            <h2>Interested in sponsoring our club?</h2>
            <p>
              Join our network of sponsors and help Princeton students explore
              quantitative research, trading, and finance with purpose.
            </p>
            <p>
              <a
                className="pqt-btn pqt-btn--quiet"
                href="/documents/pqt-sponsorship26.pdf"
              >
                View sponsorship tiers →
              </a>
            </p>
            <p>
              Questions: <a href="mailto:pqt@princeton.edu">pqt@princeton.edu</a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
