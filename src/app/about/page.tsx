export default function AboutPage() {
  return (
    <div className="bg-neutral-100 min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-neutral-05 mb-6">
            About Princeton Quantitative Traders
          </h1>
          <p className="text-xl text-neutral-60 max-w-3xl mx-auto">
            We are a community of Princeton students passionate about quantitative finance and applied mathematics, 
            dedicated to gaining practical experience and conducting original research in quantitative analysis.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-neutral-05 mb-6">Our Mission</h2>
              <p className="text-neutral-60 text-lg mb-6">
                Princeton Quantitative Traders is dedicated to fostering a community of mutually interested 
                students in quantitative finance and applied mathematics. We provide opportunities to gain 
                practical experience for quantitative trading interview processes and conduct original research projects.
              </p>
              <p className="text-neutral-60 text-lg">
                Our club is open to all undergraduate and graduate students at Princeton University, 
                creating an inclusive environment for learning and collaboration.
              </p>
            </div>
            <div className="bg-neutral-90 rounded-2xl p-8 shadow-md">
              <h3 className="text-xl font-semibold text-neutral-05 mb-4">What We Do</h3>
              <ul className="space-y-3 text-neutral-60">
                <li className="flex items-start">
                  <span className="text-bright mr-3">•</span>
                  Interview preparation for quantitative trading positions
                </li>
                <li className="flex items-start">
                  <span className="text-bright mr-3">•</span>
                  Original research projects in quantitative analysis
                </li>
                <li className="flex items-start">
                  <span className="text-bright mr-3">•</span>
                  Trading competition team formation and participation
                </li>
                <li className="flex items-start">
                  <span className="text-bright mr-3">•</span>
                  Community building for quantitative finance enthusiasts
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Officers Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-neutral-90">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-neutral-05 text-center mb-12">Meet Our Officers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Charles Muehlberger", role: "President", description: "Sophomore, ECE major" },
              { name: "Loc Tran", role: "Co-Vice President", description: "Sophomore, ORFE major" },
              { name: "Jishnu Roychoudhury", role: "Co-Vice President", description: "Junior, COS major" },
              { name: "Rodrigo Porto", role: "Treasurer", description: "Junior, Math major" },
              { name: "Jerry Han", role: "President-Emeritus", description: "Junior, Math major" },
              { name: "Tom Wang", role: "Web Development Lead", description: "Sophomore, ECE major" },
              { name: "Joshua Lin", role: "Tournament Events Officer", description: "Junior, Math major" },
              { name: "Andrew Chen", role: "Tournament Director", description: "Grad Student, Chemical Engineering major" },
              { name: "Jaime Nunez", role: "Outreach", description: "Sophomore, ORFE major" }
            ].map((officer, index) => (
              <div key={index} className="bg-neutral-85 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-neutral-05 mb-2">{officer.name}</h3>
                <p className="text-bright font-medium mb-3">{officer.role}</p>
                <p className="text-neutral-60 text-sm">{officer.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-neutral-05 text-center mb-12">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { 
                title: "Princeton: Citadel Securities Trading Challenge", 
                date: "September 25th, Thursday 5:30pm", 
                description: "Interested in learning more about trading at Citadel Securities? Apply to the Princeton trading challenge to test your market making skills against other students.",
                location: "Friend Center 08",
                link: "https://princetoncitadelsecuritiestrad.splashthat.com/"
              },
              { 
                title: "Jane Street x Princeton Quantitative Traders Game Night ", 
                date: "September 25th, Thursday 6:00pm", 
                description: "Interested in learning more about Jane Street? Students of all backgrounds and tenures are encouraged to attend - you don't need experience in finance to work at Jane Street. We hope to meet intellectually curious problem solvers!",
              },
              { 
                title: "PQT Educational Session", 
                date: "September 25th, Thursday 8:00pm", 
                description: "Come and learn about quantitative trading from our briliant class leaders!",
                location: "TBD"
              }
            ].map((event, index) => (
              <div key={index} className="bg-neutral-90 rounded-2xl p-6 shadow-md">
                <h3 className="text-xl font-semibold text-neutral-05 mb-2">{event.title}</h3>
                <p className="text-bright font-medium mb-2">{event.date}</p>
                <p className="text-neutral-60 mb-3">{event.description}</p>
                <p className="text-neutral-40 text-sm mb-4">{event.location}</p>
                {event.link && (
                  <a
                    href={event.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-bright text-neutral-100 font-medium rounded-lg hover:bg-bright/90 transition-colors duration-200 text-sm"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Learn More & Apply
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
