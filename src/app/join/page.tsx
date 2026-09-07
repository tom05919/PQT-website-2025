import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import { clubLinks } from "@/data/site";

export const metadata: Metadata = {
  title: "Join",
  description:
    "Learn about upcoming Princeton Quantitative Traders membership applications, interviews, and open sponsor events.",
};

const expectations = [
  {
    number: "01",
    title: "Applications open soon",
    description:
      "Membership applications for Princeton undergraduate and graduate students will open soon. Details will be announced in GroupMe.",
  },
  {
    number: "02",
    title: "Interview process",
    description:
      "Applicants will complete an interview before membership decisions are made.",
  },
  {
    number: "03",
    title: "Open sponsor events",
    description:
      "Most events hosted with sponsors are open to all Princeton students, including students who are not club members.",
  },
];

export default function JoinPage() {
  return (
    <main id="main-content">
      <header className="pqt-page-head pqt-page-head--join">
        <div className="pqt-container pqt-page-head__grid">
          <p className="pqt-label pqt-label--orange">Membership applications</p>
          <Reveal>
            <h1>Join Princeton Quantitative Traders</h1>
            <p>
              Applications for new members will open soon and will include an
              interview process. Most events hosted with sponsors are open to
              all Princeton students.
            </p>
            <div className="pqt-actions">
              <a
                className="pqt-btn pqt-btn--orange"
                href={clubLinks.groupMe}
                target="_blank"
                rel="noreferrer"
              >
                Get application updates <span aria-hidden="true">↗</span>
              </a>
              <a className="pqt-text-link pqt-text-link--light" href={clubLinks.email}>
                Email the team <span aria-hidden="true">→</span>
              </a>
            </div>
          </Reveal>
        </div>
      </header>

      <section className="pqt-section">
        <div className="pqt-container">
          <Reveal className="pqt-section-intro">
            <p className="pqt-label">Applications</p>
            <div>
              <h2>Membership and open events</h2>
              <p>
                Club membership requires an application and interview. Most
                sponsor events do not require club membership.
              </p>
            </div>
          </Reveal>
          <Reveal className="pqt-program-list">
            {expectations.map((expectation) => (
              <article className="pqt-program" key={expectation.number}>
                <span className="pqt-program__number">{expectation.number}</span>
                <h3>{expectation.title}</h3>
                <p>{expectation.description}</p>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="pqt-section pqt-section--soft">
        <Reveal className="pqt-container pqt-join-grid">
          <div>
            <p className="pqt-label">Process</p>
            <h2>How to apply</h2>
          </div>
          <ol className="pqt-steps">
            <li>
              <span>01</span>
              <div>
                <h3>Follow application updates</h3>
                <p>
                  Application details will be announced in GroupMe when the
                  next cycle opens.
                </p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <h3>Submit an application</h3>
                <p>Complete the membership application when it becomes available.</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <h3>Complete an interview</h3>
                <p>Applicants will interview before membership decisions are made.</p>
              </div>
            </li>
          </ol>
        </Reveal>
      </section>

    </main>
  );
}
