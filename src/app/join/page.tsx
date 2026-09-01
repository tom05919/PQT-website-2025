const applicationUrl =
  "https://docs.google.com/forms/d/1Q6CNYd_oekxA043g30jHWzbNC6qtgB-muzVjNrvJw4U/edit";

export default function JoinPage() {
  return (
    <main>
      <header className="pqt-container pqt-page-head">
        <div className="pqt-page-head__body">
          <h1>Join Princeton Quantitative Traders</h1>
          <p className="pqt-lead">
            Become part of a community of Princeton students who share
            curiosity, rigor, and collaboration. Membership is open to currently
            enrolled undergraduate and graduate students.
          </p>
          <div className="pqt-cluster">
            <a
              className="pqt-btn pqt-btn--solid"
              href={applicationUrl}
              target="_blank"
              rel="noreferrer"
            >
              Open membership form
            </a>
          </div>
        </div>
      </header>

      <section className="pqt-container pqt-section">
        <div className="pqt-longform">
          <div className="pqt-longform__body">
            <h2>Membership Requirements</h2>
            <p className="pqt-note">
              The stated prerequisites are Princeton enrollment and an interest
              in quantitative finance and applied mathematics.
            </p>
            <div className="pqt-row">
              <article className="pqt-item">
                <h3 className="pqt-item__title">Academic eligibility</h3>
                <p>
                  Currently enrolled undergraduate or graduate students at
                  Princeton University, across backgrounds and majors.
                </p>
              </article>
              <article className="pqt-item">
                <h3 className="pqt-item__title">Club participation</h3>
                <p>
                  Members commit to club activities and research projects,
                  actively engaging in events, project-based learning, interview
                  preparation, and trading competitions.
                </p>
              </article>
              <article className="pqt-item">
                <h3 className="pqt-item__title">Conduct</h3>
                <p>
                  Members are expected to contribute to the collaborative
                  culture of the club and maintain academic integrity and
                  professionalism.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="pqt-container pqt-section">
        <div className="pqt-longform">
          <div className="pqt-longform__body">
            <h2>Weekly meeting times</h2>
            <div className="pqt-table-wrap">
              <table className="pqt-table">
                <thead>
                  <tr>
                    <th>Session</th>
                    <th>Day</th>
                    <th>Time</th>
                    <th>Location</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Project session</td>
                    <td>TBD</td>
                    <td className="pqt-td-num">TBD</td>
                    <td>Shared through listserv and GroupMe</td>
                  </tr>
                  <tr>
                    <td>Interview preparation</td>
                    <td>TBD</td>
                    <td className="pqt-td-num">TBD</td>
                    <td>Shared through listserv and GroupMe</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="pqt-container pqt-section">
        <div className="pqt-longform">
          <div className="pqt-longform__body">
            <h2>How to get started</h2>
            <ol className="pqt-steps">
              <li>Review the membership expectations and weekly schedule.</li>
              <li>
                Submit the club&apos;s membership form with the button at the top
                of this page.
              </li>
              <li>
                Follow session updates through the club&apos;s GroupMe and
                listserv.
              </li>
            </ol>
            <p>
              Questions: <a href="mailto:pqt@princeton.edu">pqt@princeton.edu</a>
            </p>
            <p>
              <a href="https://groupme.com/join_group/111159295/jL93cFqW">
                Open the club GroupMe ↗
              </a>
            </p>
          </div>
        </div>
      </section>

      <section className="pqt-container pqt-section">
        <div className="pqt-longform">
          <div className="pqt-longform__body">
            <h2>Ready to get started?</h2>
            <p>
              Take your first step into quantitative trading, data-driven
              research, and a welcoming academic community.
            </p>
            <p>
              Questions? Reach out to the membership team at
              {" "}<a href="mailto:pqt@princeton.edu">pqt@princeton.edu</a>.
            </p>
            <p>Campus Group: Princeton Quantitative Traders</p>
            <p>
              <a
                className="pqt-btn pqt-btn--quiet"
                href={applicationUrl}
                target="_blank"
                rel="noreferrer"
              >
                Start application →
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
