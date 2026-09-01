import Link from "next/link";

const events = [
  {
    title: "PQT Fall Trading Competition 2025",
    date: "November 22, 2025",
    description:
      "PQT's first trading competition. Students participated in eight rounds of a trading game using a price distribution, live market updates, and forced trades based on their positions.",
    materials: [
      {
        label: "Opening Slides",
        href: "https://docs.google.com/presentation/d/1RwFBHAHHFX3gDR4hwMGh7NcxoejEfTR1nqP94tbmF18/edit?usp=sharing",
      },
      {
        label: "Rounds 1–8 Folder",
        href: "https://drive.google.com/drive/folders/17p3TQaNijcdxqyxTr2MtW6nBulJAXyUT?usp=sharing",
      },
    ],
  },
  {
    title: "COSCON × PQT Trading Game 2025",
    date: "November 16, 2025",
    description:
      "A trading game hosted by COSCON and PQT where students bet on a bracket of teams using distributions of team attributes.",
    materials: [
      {
        label: "Game Statistics",
        href: "https://princeton-quant.com/tournament/info",
      },
    ],
  },
  {
    title: "Mock Interview Prep Sheets",
    date: "November 6, 2025",
    description: "Mock interview preparation for quantitative trading roles.",
    materials: [
      {
        label: "Interview Prep Folder",
        href: "https://drive.google.com/drive/folders/1_ifBkErkxHFHMaHBC4jUSghe4U5IOAIa?usp=drive_link",
      },
    ],
  },
  {
    title: "PQT Project Series",
    date: "October 22, 2025",
    description:
      "A showcase of ongoing projects, from algorithmic research to data-driven experiments, with an open repository for contributions.",
    materials: [
      {
        label: "Project GitHub Link",
        href: "https://github.com/charlespers/PQT_Education_Series_25-26",
      },
    ],
  },
  {
    title: "PQT Education Series: Probabilities",
    date: "September 25, 2025",
    description:
      "An introduction to probability theory used in quantitative finance, connecting mathematical ideas with practical intuition.",
    materials: [
      {
        label: "Beginner Slides",
        href: "/documents/pqt_ed_series_beginner.pdf",
      },
      {
        label: "Advanced Slides",
        href: "/documents/pqt_ed_series_advanced.pdf",
      },
    ],
  },
  {
    title: "Princeton Quantitative Traders Info Session",
    date: "September 12, 2025",
    description:
      "An overview of the club, its mission, and its upcoming initiatives for the semester.",
    materials: [
      {
        label: "Presentation Slides",
        href: "/documents/pqt-info-session.pdf",
      },
    ],
  },
];

export default function PastEventsPage() {
  return (
    <main>
      <header className="pqt-container pqt-page-head">
        <div className="pqt-page-head__body">
          <h1>Past Events</h1>
          <p className="pqt-lead">
            A look back at the sessions, projects, competitions, and discussions
            of Princeton Quantitative Traders.
          </p>
        </div>
      </header>

      <section className="pqt-container pqt-section">
        <div className="pqt-table-wrap">
          <table className="pqt-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Date</th>
                <th>Description</th>
                <th>Materials</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.title}>
                  <td>{event.title}</td>
                  <td className="pqt-td-num">{event.date}</td>
                  <td>{event.description}</td>
                  <td>
                    <span className="pqt-resource-links">
                      {event.materials.map((material) => (
                        <a href={material.href} key={material.label}>
                          {material.label}
                        </a>
                      ))}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="pqt-container pqt-section">
        <div className="pqt-longform">
          <div className="pqt-longform__body">
            <h2>Stay connected</h2>
            <p>
              Be the first to hear about new projects, workshops, and education
              sessions by joining the club community.
            </p>
            <div>
              <Link className="pqt-btn pqt-btn--solid" href="/join">
                Join our club
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
