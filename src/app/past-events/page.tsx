import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { events } from "@/data/site";

export const metadata: Metadata = {
  title: "Past Events",
  description:
    "An archive of Princeton Quantitative Traders competitions, projects, education sessions, and materials.",
};

export default function PastEventsPage() {
  return (
    <main id="main-content">
      <header className="pqt-page-head">
        <div className="pqt-container pqt-page-head__grid">
          <p className="pqt-label pqt-label--orange">Archive</p>
          <Reveal>
            <h1>Past Events</h1>
            <p>
              A record of the club&apos;s competitions, education series, project
              work, and shared materials.
            </p>
          </Reveal>
        </div>
      </header>

      <section className="pqt-section">
        <div className="pqt-container">
          <div className="pqt-archive-head" aria-hidden="true">
            <span>Date</span>
            <span>Event</span>
            <span>Materials</span>
          </div>
          <Reveal className="pqt-event-list">
            {events.map((event) => (
              <article className="pqt-event" key={event.title}>
                <div className="pqt-event__date">
                  <time>{event.date}</time>
                </div>
                <div className="pqt-event__body">
                  <h2>{event.title}</h2>
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

      <section className="pqt-page-link">
        <div className="pqt-container">
          <p>Club announcements and meeting details are shared through GroupMe.</p>
          <Link className="pqt-text-link" href="/join">
            Membership information <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
