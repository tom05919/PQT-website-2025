export default function AboutPage() {
  return (
    <main>
      <header className="pqt-container pqt-page-head">
        <div className="pqt-page-head__body">
          <h1>About Princeton Quantitative Traders</h1>
          <p className="pqt-lead">
            A community of Princeton students exploring quantitative finance,
            data, and applied mathematics across backgrounds, majors, and
            class years.
          </p>
        </div>
      </header>

      <section className="pqt-container pqt-section pqt-section--first">
        <div className="pqt-longform">
          <div className="pqt-longform__body">
            <h2>Our Mission</h2>
            <p>
              Princeton Quantitative Traders was founded to solve the
              bifurcation of theory learned at Princeton to industry
              application.
            </p>
            <p>
              Thus, our mission is to cultivate a space for members to apply
              theoretical ideas into practice. Our main areas of interest are
              in mathematics, programming, and reasoning. We’re open to all
              Princeton students, regardless of background and hope to
              emphasize collaberation over competition.
            </p>
          </div>
        </div>
      </section>

      <section className="pqt-container pqt-section">
        <div className="pqt-longform">
          <div className="pqt-longform__body">
            <h2>What We Do</h2>
            <ul>
              <li>
                Weekly interview preperation for quantitative trading
                positions. Sessions are held on Thursdays at 8:00pm, more
                information on location and content can be found on listserv or
                our GroupMe.
              </li>
              <li>
                Weekly project sessions focused on understanding market
                structure and how to interpret data within a trading system.
                Project sessions are held on Wednesdays at 9:00pm, more
                information on location and content can be found on listserv or
                our GroupMe.
              </li>
              <li>
                National trading competitions hosted each semester with
                opportunities to win prizes and network with industry
                professionals.
              </li>
              <li>Workshops and talks with industry mentors</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="pqt-container pqt-section">
        <div className="pqt-section-head">
          <div className="pqt-section-head__body">
            <h2>Upcoming events</h2>
          </div>
        </div>
        <article className="pqt-item">
          <p className="pqt-item__meta">
            Date: TBD · Time: TBD · Location: TBD
          </p>
          <h3 className="pqt-item__title">Coming soon!</h3>
        </article>
      </section>

      <section className="pqt-container pqt-section">
        <div className="pqt-section-head">
          <div className="pqt-section-head__body">
            <h2>Past events</h2>
          </div>
        </div>
        <div className="pqt-table-wrap">
          <table className="pqt-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Date</th>
                <th>Location</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Princeton: Citadel Securities Trading Challenge</td>
                <td className="pqt-td-num">Thursday, September 25 · 5:30 PM</td>
                <td>Friend Center 08</td>
                <td>
                  A collaborative market-making challenge testing real-world
                  trading strategies among Princeton peers.
                  {" "}
                  <a href="https://princetoncitadelsecuritiestrad.splashthat.com/">
                    Event page ↗
                  </a>
                </td>
              </tr>
              <tr>
                <td>Jane Street × PQT Game Night</td>
                <td className="pqt-td-num">Thursday, September 25 · 6:00 PM</td>
                <td>Not listed</td>
                <td>
                  An open event where problem-solving meets community. Students
                  of all backgrounds are welcome.
                </td>
              </tr>
              <tr>
                <td>PQT Educational Session</td>
                <td className="pqt-td-num">Thursday, September 25 · 8:30 PM</td>
                <td>Friend Center 08 / Friend Center 06</td>
                <td>
                  A peer-led exploration of quantitative trading fundamentals
                  that is practical, collaborative, and concept-focused.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="pqt-container pqt-section">
        <div className="pqt-longform">
          <div className="pqt-longform__body">
            <h2>Projects and learning materials</h2>
            <p>
              The club has published project work, probability lessons, and
              interview-preparation materials from its 2025 program.
            </p>
            <div className="pqt-table-wrap">
              <table className="pqt-table">
                <thead>
                  <tr>
                    <th>Program</th>
                    <th>Date</th>
                    <th>Material</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Interview preparation</td>
                    <td className="pqt-td-num">November 6, 2025</td>
                    <td>
                      <a href="https://drive.google.com/drive/folders/1_ifBkErkxHFHMaHBC4jUSghe4U5IOAIa?usp=drive_link">
                        Prep sheets ↗
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td>PQT Project Series</td>
                    <td className="pqt-td-num">October 22, 2025</td>
                    <td>
                      <a href="https://github.com/charlespers/PQT_Education_Series_25-26">
                        Project repository ↗
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td>Education Series: Probabilities</td>
                    <td className="pqt-td-num">September 25, 2025</td>
                    <td>
                      <span className="pqt-resource-links">
                        <a href="/documents/pqt_ed_series_beginner.pdf">
                          Beginner slides
                        </a>
                        <a href="/documents/pqt_ed_series_advanced.pdf">
                          Advanced slides
                        </a>
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>Club info session</td>
                    <td className="pqt-td-num">September 12, 2025</td>
                    <td>
                      <a href="/documents/pqt-info-session.pdf">
                        Presentation slides
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
