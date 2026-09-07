import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import {
  events,
  goldSponsors,
  programs,
  silverSponsors,
} from "@/data/site";

const featuredEvents = events.slice(0, 3);
const sponsors = [...goldSponsors, ...silverSponsors];

export default function Home() {
  return (
    <main id="main-content">
      <section className="pqt-home-hero" aria-labelledby="home-title">
        <Image
          className="pqt-home-hero__image"
          src="/images/website_backdrop.jpg"
          alt="Princeton University campus"
          fill
          priority
          sizes="100vw"
        />
        <div className="pqt-container pqt-home-hero__grid">
          <Reveal className="pqt-home-hero__content">
            <h1 id="home-title">Princeton Quantitative Traders</h1>
            <p className="pqt-home-hero__lead">
              Princeton Quantitative Traders is a community for students
              exploring quantitative finance, market structure, data, and
              applied mathematics.
            </p>
            <div className="pqt-actions">
              <Link className="pqt-btn pqt-btn--orange" href="/join">
                Join PQT <span aria-hidden="true">↗</span>
              </Link>
              <Link className="pqt-text-link pqt-text-link--light" href="/about">
                How the club works <span aria-hidden="true">→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pqt-sponsor-band" aria-label="Club sponsors">
        <Reveal className="pqt-container">
          <div className="pqt-sponsor-strip">
            {sponsors.map((sponsor) => (
              <div className="pqt-sponsor-strip__item" key={sponsor.name}>
                <Image
                  src={sponsor.logo}
                  alt={`${sponsor.name} logo`}
                  width={180}
                  height={56}
                />
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="pqt-section">
        <div className="pqt-container">
          <Reveal className="pqt-section-intro pqt-section-intro--plain">
            <div>
              <h2>What we do</h2>
              <p>
                Members learn together through research, technical practice,
                and trading games designed to connect classroom thinking with
                real problems.
              </p>
            </div>
          </Reveal>

          <Reveal className="pqt-program-list" delay={0.08}>
            {programs.map((program) => (
              <article className="pqt-program" key={program.number}>
                <h3>{program.title}</h3>
                <p>{program.description}</p>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="pqt-section pqt-section--soft">
        <div className="pqt-container">
          <Reveal className="pqt-section-title-row">
            <div>
              <h2>Recent events</h2>
            </div>
            <Link className="pqt-text-link" href="/past-events">
              View all events <span aria-hidden="true">→</span>
            </Link>
          </Reveal>

          <Reveal className="pqt-event-list pqt-event-list--featured" delay={0.08}>
            {featuredEvents.map((event) => (
              <article className="pqt-event" key={event.title}>
                <div className="pqt-event__date">
                  <time>{event.date}</time>
                </div>
                <div className="pqt-event__body">
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                </div>
                {event.materials.length > 0 ? (
                  <div className="pqt-event__links" aria-label={`${event.title} materials`}>
                    {event.materials.map((material) => (
                      <a
                        href={material.href}
                        target={material.href.startsWith("http") ? "_blank" : undefined}
                        rel={material.href.startsWith("http") ? "noreferrer" : undefined}
                        key={material.label}
                      >
                        {material.label} <span aria-hidden="true">↗</span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <span className="pqt-event__empty" aria-label="No public materials">—</span>
                )}
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="pqt-cta">
        <Reveal className="pqt-container pqt-cta__grid pqt-cta__grid--plain">
          <div>
            <h2>Join Princeton Quantitative Traders</h2>
            <p>
              Undergraduate and graduate students from every background are
              welcome to take part in the community.
            </p>
            <Link className="pqt-btn pqt-btn--light" href="/join">
              Ways to join <span aria-hidden="true">→</span>
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
