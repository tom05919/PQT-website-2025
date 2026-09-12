import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { officers, programs } from "@/data/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Princeton Quantitative Traders, its programs, and its student leadership.",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
}

export default function AboutPage() {
  return (
    <main id="main-content">
      <header className="pqt-page-head">
        <div className="pqt-container pqt-page-head__grid">
          <p className="pqt-label pqt-label--orange">About PQT</p>
          <Reveal>
            <h1>About Princeton Quantitative Traders</h1>
            <p>
              Princeton Quantitative Traders brings together students across
              majors and class years to explore quantitative finance, data,
              mathematics, and programming.
            </p>
          </Reveal>
        </div>
      </header>

      <section className="pqt-section">
        <div className="pqt-container pqt-story-grid">
          <p className="pqt-label">Club overview</p>
          <Reveal className="pqt-story-copy">
            <h2>Our mission</h2>
            <div className="pqt-story-copy__columns">
              <p>
                The club connects academic theory with industry application
                through collaborative projects, interview preparation, trading
                competitions, workshops, and talks.
              </p>
              <p>
                Our work centers on mathematics, programming, and analytical
                reasoning. Membership is open to Princeton students across
                backgrounds, with collaboration taking priority over internal
                competition.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pqt-section pqt-section--soft">
        <div className="pqt-container">
          <Reveal className="pqt-section-title-row">
            <div>
              <p className="pqt-label">Member activities</p>
              <h2>Programs</h2>
            </div>
            <Link className="pqt-text-link" href="/join">
              Join the community <span aria-hidden="true">→</span>
            </Link>
          </Reveal>
          <Reveal className="pqt-program-list">
            {programs.map((program) => (
              <article className="pqt-program" key={program.number}>
                <h3>{program.title}</h3>
                <p>{program.description}</p>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="pqt-section">
        <div className="pqt-container">
          <Reveal className="pqt-section-intro">
            <p className="pqt-label">Student leadership</p>
            <div>
              <h2>Officers</h2>
              <p>
                Meet the 2026–27 board organizing the club&apos;s education,
                competitions, partnerships, and recruitment.
              </p>
            </div>
          </Reveal>

          <Reveal className="pqt-officer-grid">
            {officers.map((officer) => (
              <article className="pqt-officer" key={officer.name}>
                {officer.photo ? (
                  <div className="pqt-officer__photo">
                    <Image
                      src={officer.photo}
                      alt={`${officer.name}, ${officer.role}`}
                      fill
                      sizes="(max-width: 700px) calc(100vw - 3rem), (max-width: 1050px) calc(50vw - 3rem), 30vw"
                    />
                  </div>
                ) : (
                  <div className="pqt-officer__initials" aria-hidden="true">
                    {initials(officer.name)}
                  </div>
                )}
                <div className="pqt-officer__identity">
                  <h3>{officer.name}</h3>
                  <p>{officer.role}</p>
                </div>
                <p className="pqt-officer__detail">{officer.detail}</p>
                {officer.interest && (
                  <p className="pqt-officer__interest">{officer.interest}</p>
                )}
                {officer.linkedin && (
                  <div className="pqt-officer__links">
                    <a href={officer.linkedin} target="_blank" rel="noreferrer">
                      LinkedIn ↗
                    </a>
                  </div>
                )}
              </article>
            ))}
          </Reveal>
        </div>
      </section>
    </main>
  );
}
