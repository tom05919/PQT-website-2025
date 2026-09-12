import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import { clubLinks } from "@/data/site";

export const metadata: Metadata = {
  title: "Join",
  description:
    "Princeton Quantitative Traders 2026–2027 application timeline: info session September 10, resume drop September 10–12, and interviews September 15 and 17.",
};

const timeline = [
  {
    date: "September 10",
    dateTime: "2026-09-10",
    title: "Info Session",
    detail: "Lewis Center 138",
  },
  {
    date: "September 10–12",
    dateTime: "2026-09-10",
    title: "Resume Drop",
    detail: "Online",
    href: clubLinks.resumeDrop,
  },
  {
    date: "September 15",
    dateTime: "2026-09-15",
    title: "Round I Interviews",
    detail: "Brainteasers & behavioral",
  },
  {
    date: "September 17",
    dateTime: "2026-09-17",
    title: "Round II Interviews",
  },
];

export default function JoinPage() {
  return (
    <main id="main-content">
      <header className="pqt-page-head pqt-page-head--join">
        <div className="pqt-container pqt-page-head__grid">
          <p className="pqt-label pqt-label--orange">Fall 2026 recruitment</p>
          <Reveal>
            <h1>Join Princeton Quantitative Traders</h1>
            <p>
              Explore quantitative trading with Princeton students. Submit your
              resume September 10–12 for the 2026–2027 application cycle, with
              interviews on September 15 and 17.
            </p>
            <div className="pqt-actions">
              <a className="pqt-btn pqt-btn--orange" href="#application-timeline">
                View application timeline <span aria-hidden="true">↓</span>
              </a>
              <a className="pqt-text-link pqt-text-link--light" href={clubLinks.email}>
                Email the team <span aria-hidden="true">→</span>
              </a>
            </div>
          </Reveal>
        </div>
      </header>

      <section className="pqt-section" id="application-timeline" aria-labelledby="timeline-title">
        <div className="pqt-container">
          <Reveal className="pqt-section-intro">
            <p className="pqt-label">2026–2027</p>
            <div>
              <h2 id="timeline-title">Application timeline</h2>
              <p>From the first introduction to the final interview.</p>
            </div>
          </Reveal>
          <Reveal>
            <ol className="pqt-application-timeline">
              {timeline.map((step, index) => (
                <li key={step.title}>
                  <span className="pqt-application-timeline__number" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <time dateTime={step.dateTime}>{step.date}</time>
                  <h3>{step.title}</h3>
                  {step.detail && <p>{step.detail}</p>}
                  {step.href && (
                    <a className="pqt-text-link" href={step.href} target="_blank" rel="noreferrer">
                      Submit your resume <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <section className="pqt-section pqt-section--soft">
        <Reveal className="pqt-container pqt-join-grid">
          <div>
            <p className="pqt-label">Membership</p>
            <h2>Stay connected</h2>
          </div>
          <div className="pqt-join-details">
            <h3>Open to Princeton students</h3>
            <p>
              Undergraduate and graduate students can apply for membership.
              Most sponsor events are open to all Princeton students, including
              those who are not club members.
            </p>
            <a className="pqt-text-link" href={clubLinks.groupMe} target="_blank" rel="noreferrer">
              Get updates in GroupMe <span aria-hidden="true">↗</span>
            </a>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
