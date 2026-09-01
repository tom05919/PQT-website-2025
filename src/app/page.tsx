import Image from "next/image";
import Link from "next/link";

const officers = [
  {
    name: "Grace Im",
    role: "President",
    detail: "Sophomore · Philosophy",
    interest: "AI, stochastic modeling, and reliable autonomy research",
    image: "",
    linkedin: "",
    instagram: "",
  },
  {
    name: "Ahbi Bansal",
    role: "Vice President",
    detail: "Senior · Economics",
    interest: "The intersection of finance and technology",
    image: "",
    linkedin: "",
    instagram: "",
  },
  {
    name: "Brandon Wilk",
    role: "Treasurer",
    detail: "Junior · MAE",
    image: "",
    linkedin: "",
    instagram: "",
  },
  {
    name: "Jerry Han",
    role: "President-Emeritus",
    detail: "Junior · Mathematics",
    interest: "Trading and state-space model research",
    image: "https://media.licdn.com/dms/image/v2/D4E03AQGd-QPCGBDQaQ/profile-displayphoto-scale_400_400/B4EZnRQS1QIMAg-/0/1760152334915?e=1763596800&v=beta&t=_jACbD-dTwU4o0wNkTmwv-zeGVXh1NMcj5DXHeWC40w",
    linkedin: "https://www.linkedin.com/in/jerry-han/",
    instagram: "https://www.instagram.com/j.erry.han/",
  },
  {
    name: "Tom Wang",
    role: "Tech Lead",
    detail: "Sophomore · ECE",
    interest: "Generalist robots, machine learning, and embedded systems",
    image: "https://media.licdn.com/dms/image/v2/D4E03AQEAijlufTxPiw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1706971701106?e=1763596800&v=beta&t=eh3wSvKyQBI4oqdff4hELLzXmRrGpgu-yfzcok0Wk_U",
    linkedin: "https://www.linkedin.com/in/tom-wang-105a6722b/",
    instagram: "https://www.instagram.com/tom_wang_05/",
  },
  {
    name: "Joshua Lin",
    role: "Tournament Events Officer",
    detail: "Junior · Mathematics",
    interest: "Optimization, probability, and analysis",
    image: "https://media.licdn.com/dms/image/v2/D4E03AQF8iE4_LFn0ag/profile-displayphoto-shrink_400_400/B4EZYiuwgzHgAk-/0/1744339405331?e=1763596800&v=beta&t=1c4hVnKYd4VHrieoEC_kq0uMiy5InWw6Rsk1vk3kMFY",
    linkedin: "https://www.linkedin.com/in/lintropic-joshua/",
    instagram: "https://www.instagram.com/perplexed._.panda/",
  },
  {
    name: "Andrew Chen",
    role: "Tournament Director",
    detail: "Graduate student · Chemical Engineering",
    image: "https://media.licdn.com/dms/image/v2/D5603AQGUGLyXDiAQyA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1692736493041?e=1763596800&v=beta&t=4l3eYxt_4PISD2NEDr94Ua71ekD9QT8FxJntXveDJbA",
    linkedin: "https://www.linkedin.com/in/andrewchen0201/",
    instagram: "https://www.instagram.com/an6rew_chen/",
  },
];

export default function Home() {
  return (
    <main>
      <section className="pqt-home-hero" aria-labelledby="home-title">
        <div className="pqt-container pqt-home-hero__inner">
          <div className="pqt-home-hero__content">
            <p className="pqt-label pqt-home-hero__eyebrow">
              Princeton University
            </p>
            <h1 className="pqt-home-title" id="home-title">
              Princeton Quantitative Traders
            </h1>
            <p className="pqt-home-hero__copy">
              The official Princeton University quantitative trading club,
              exploring quantitative finance, data, and applied mathematics.
            </p>
            <div className="pqt-home-hero__actions">
              <Link className="pqt-btn pqt-btn--solid" href="/join">
                Join our club
              </Link>
              <Link className="pqt-btn pqt-btn--quiet" href="/about">
                Learn more →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="pqt-home-program-strip">
        <div
          className="pqt-container pqt-home-facts"
          aria-label="Club program schedule"
        >
          <div className="pqt-home-fact">
            <p className="pqt-home-fact__value">TBD</p>
            <p className="pqt-home-fact__label">Project sessions</p>
          </div>
          <div className="pqt-home-fact">
            <p className="pqt-home-fact__value">TBD</p>
            <p className="pqt-home-fact__label">Interview preparation</p>
          </div>
          <div className="pqt-home-fact">
            <p className="pqt-home-fact__value">TBD</p>
            <p className="pqt-home-fact__label">Trading competition</p>
          </div>
        </div>
      </div>

      <section className="pqt-container pqt-section">
        <div className="pqt-section-head">
          <div className="pqt-section-head__body">
            <h2>Research &amp; Learning</h2>
            <p className="pqt-lead">
              From theoretical models to practical trading systems, members
              explore quantitative structure through collaboration, mentorship,
              projects, and industry workshops as a community of analytical
              thinkers.
            </p>
          </div>
        </div>
        <div className="pqt-row">
          <article className="pqt-item">
            <p className="pqt-item__meta">TBD</p>
            <h3 className="pqt-item__title">Research and projects</h3>
            <p>
              Members conduct original quantitative analysis and study market
              structure, machine learning, and data within trading systems.
            </p>
          </article>
          <article className="pqt-item">
            <p className="pqt-item__meta">TBD</p>
            <h3 className="pqt-item__title">Interview preparation</h3>
            <p>
              Weekly sessions prepare members for quantitative trading roles at
              top firms through collaborative practice and shared materials.
            </p>
          </article>
          <article className="pqt-item">
            <p className="pqt-item__meta">TBD</p>
            <h3 className="pqt-item__title">Trading competitions</h3>
            <p>
              National competitions offer opportunities to win prizes and meet
              industry professionals.
            </p>
          </article>
        </div>
      </section>

      <section className="pqt-container pqt-section">
        <div className="pqt-section-head">
          <div className="pqt-section-head__body">
            <h2>Current Programs</h2>
            <p>
              Locations, content, and updates are shared through the club
              listserv and GroupMe.
            </p>
          </div>
        </div>
        <div className="pqt-table-wrap">
          <table className="pqt-table">
            <thead>
              <tr>
                <th>Program</th>
                <th>Cadence</th>
                <th>Time</th>
                <th>Focus</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Project sessions</td>
                <td>Weekly</td>
                <td className="pqt-td-num">TBD</td>
                <td>Machine learning, research, and market structure</td>
              </tr>
              <tr>
                <td>Interview preparation</td>
                <td>Weekly</td>
                <td className="pqt-td-num">TBD</td>
                <td>Quantitative trading interview practice</td>
              </tr>
              <tr>
                <td>Trading competition</td>
                <td>Each semester</td>
                <td className="pqt-td-num">TBD</td>
                <td>National trading competition</td>
              </tr>
              <tr>
                <td>COSCON × PQT Trading Game</td>
                <td>One-time event</td>
                <td className="pqt-td-num">November 16, 2025</td>
                <td>
                  <span className="pqt-resource-links">
                    <a href="https://docs.google.com/forms/d/e/1FAIpQLSctc8kj4kSqcGILcnSzHVq91J1wlUO0bfZ0ZUYuy64_JxoLPA/viewform">
                      Event signup
                    </a>
                    <a href="https://princeton-quant.com/tournament/info">
                      Game statistics
                    </a>
                  </span>
                </td>
              </tr>
              <tr>
                <td>PQT Fall Trading Competition</td>
                <td>One-time event</td>
                <td className="pqt-td-num">November 22, 2025</td>
                <td>
                  <span className="pqt-resource-links">
                    <a href="https://docs.google.com/presentation/d/1RwFBHAHHFX3gDR4hwMGh7NcxoejEfTR1nqP94tbmF18/edit?usp=sharing">
                      Opening slides
                    </a>
                    <a href="https://drive.google.com/drive/folders/17p3TQaNijcdxqyxTr2MtW6nBulJAXyUT?usp=sharing">
                      Rounds 1–8
                    </a>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="pqt-container pqt-section">
        <div className="pqt-section-head">
          <div className="pqt-section-head__body">
            <h2>Meet Our Officers</h2>
          </div>
        </div>
        <div className="pqt-officer-grid">
          {officers.map((officer) => (
            <article className="pqt-officer" key={officer.name}>
              <Image
                className="pqt-officer__photo"
                src={officer.image}
                alt={officer.name}
                width={176}
                height={176}
                sizes="(max-width: 520px) 176px, (max-width: 900px) 25vw, 176px"
                unoptimized
              />
              <div>
                <p className="pqt-officer__name">{officer.name}</p>
                <p className="pqt-officer__role">{officer.role}</p>
              </div>
              <p className="pqt-officer__detail">{officer.detail}</p>
              {officer.interest && (
                <p className="pqt-officer__interest">{officer.interest}</p>
              )}
              <div className="pqt-resource-links">
                <a
                  className="pqt-officer__link"
                  href={officer.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn ↗
                </a>
                <a
                  className="pqt-officer__link"
                  href={officer.instagram}
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram ↗
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="pqt-container pqt-section">
        <div className="pqt-longform">
          <div className="pqt-longform__body">
            <h2>Want to join?</h2>
            <p>
              Interested in joining a community of like-minded peers, applying
              theory to practice through real-world projects, or competing in
              national trading competitions?
            </p>
            <p>
              Membership is open to currently enrolled Princeton undergraduate
              and graduate students. Dates and times for future weekly sessions
              are TBD.
            </p>
            <p>
              Questions: <a href="mailto:pqt@princeton.edu">pqt@princeton.edu</a>
            </p>
            <h3>Club Socials</h3>
            <p>
              Follow the club on Instagram and join the GroupMe to stay updated
              on club events and opportunities, ask questions, and connect with
              other members.
            </p>
            <div className="pqt-cluster">
              <Link className="pqt-btn pqt-btn--solid" href="/join">
                Become a Member
              </Link>
              <a
                className="pqt-btn pqt-btn--quiet"
                href="https://www.instagram.com/princetonquanttraders/"
              >
                Instagram →
              </a>
              <a
                className="pqt-btn pqt-btn--quiet"
                href="https://groupme.com/join_group/111159295/jL93cFqW"
              >
                GroupMe →
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
