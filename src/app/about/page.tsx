export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#d2c3b3] text-[#2e2b28] font-sans antialiased">
      {/* Hero Section */}
      <section className="py-28 px-6 sm:px-10 lg:px-16 border-b border-[#c0ae9f]/50">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-semibold mb-6 tracking-tight">
            About <span className="text-[#b46b35]">Princeton Quantitative Traders</span>
          </h1>
          <p className="text-lg md:text-xl text-[#463f3a] max-w-3xl mx-auto leading-relaxed">
            We’re a community of Princeton students exploring quantitative finance, data, and applied mathematics —
            blending research, collaboration, and professional growth.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 px-6 sm:px-10 lg:px-16 border-b border-[#c0ae9f]/50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="text-3xl font-semibold mb-4 text-[#2e2b28]">Our Mission</h2>
            <p className="text-[#463f3a] text-lg mb-6 leading-relaxed">
              Princeton Quantitative Traders cultivates a space for curiosity and mastery — where students can grow
              their skills in mathematics, programming, and financial reasoning. We emphasize real-world projects,
              mock interviews, and mentorship.
            </p>
            <p className="text-[#463f3a] text-lg leading-relaxed">
              We’re open to all Princeton students, regardless of background, fostering collaboration and exploration
              over competition.
            </p>
          </div>
          <div className="bg-[#d8c6b8] rounded-2xl p-8">
            <h3 className="text-xl font-semibold text-[#2e2b28] mb-6">What We Do</h3>
            <ul className="space-y-3 text-[#463f3a]">
              {[
                "Interview preparation for quantitative trading positions",
                "Original research in data-driven finance",
                "Team-based trading competitions",
                "Workshops and talks with industry mentors",
              ].map((item, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-[#b46b35] mr-3 text-lg">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Officers Section */}
      <section className="py-24 px-6 sm:px-10 lg:px-16 bg-[#cbb6a6] border-b border-[#bda89a]/40">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-16">Meet Our Officers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
            {[
              { name: "Charles Muehlberger", role: "President", description: "Sophomore, ECE major" },
              { name: "Loc Tran", role: "Vice President", description: "Sophomore, ORFE major" },
              { name: "Rodrigo Porto", role: "Treasurer", description: "Junior, Math major" },
              { name: "Jerry Han", role: "President-Emeritus", description: "Junior, Math major" },
              { name: "Tom Wang", role: "Web Development Lead", description: "Sophomore, ECE major" },
              { name: "Joshua Lin", role: "Tournament Events Officer", description: "Junior, Math major" },
              { name: "Andrew Chen", role: "Tournament Director", description: "Grad Student, ChemE major" },
              { name: "Jaime Nunez", role: "Outreach", description: "Sophomore, ORFE major" },
            ].map((officer, index) => (
              <div key={index} className="text-left group">
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-[#2e2b28] group-hover:text-[#b46b35] transition-colors">
                    {officer.name}
                  </h3>
                  <p className="text-[#b46b35] font-medium">{officer.role}</p>
                </div>
                <p className="text-sm text-[#463f3a] leading-relaxed">{officer.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-24 px-6 sm:px-10 lg:px-16 border-b border-[#bda89a]/40">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-12">Upcoming Events</h2>
          <div className="space-y-10">
            {[
              {
                title: "PQT Trading Competition",
                date: "TBD",
                description:
                  "Our first in-house trading competition — test your strategy and quantitative insight in simulated markets inspired by real-world conditions.",
                location: "TBD",
              },
            ].map((event, index) => (
              <div key={index} className="bg-[#d8c6b8]/60 rounded-xl p-8">
                <h3 className="text-2xl font-semibold text-[#2e2b28] mb-2">{event.title}</h3>
                <p className="text-[#b46b35] font-medium mb-3">{event.date}</p>
                <p className="text-[#463f3a] mb-3 leading-relaxed">{event.description}</p>
                <p className="text-sm text-[#5b514c]">{event.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Past Events Section */}
      <section className="py-24 px-6 sm:px-10 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-12">Past Events</h2>
          <div className="space-y-10">
            {[
              {
                title: "Princeton: Citadel Securities Trading Challenge",
                date: "September 25th, Thursday 5:30pm",
                description:
                  "A collaborative market-making challenge with Citadel Securities — testing real-world trading strategies among Princeton peers.",
                location: "Friend Center 08",
                link: "https://princetoncitadelsecuritiestrad.splashthat.com/",
              },
              {
                title: "Jane Street x PQT Game Night",
                date: "September 25th, Thursday 6:00pm",
                description:
                  "An open event with Jane Street where problem-solving meets community. Students of all backgrounds are welcome.",
              },
              {
                title: "PQT Educational Session",
                date: "September 25th, Thursday 8:30pm",
                description:
                  "A peer-led exploration into quantitative trading fundamentals — practical, collaborative, and concept-focused.",
                location: "Friend Center 08 / Friend Center 06",
              },
            ].map((event, index) => (
              <div key={index} className="bg-[#d8c6b8]/60 rounded-xl p-8">
                <h3 className="text-2xl font-semibold text-[#2e2b28] mb-2">{event.title}</h3>
                <p className="text-[#b46b35] font-medium mb-3">{event.date}</p>
                <p className="text-[#463f3a] mb-3 leading-relaxed">{event.description}</p>
                <p className="text-sm text-[#5b514c] mb-3">{event.location}</p>
                {event.link && (
                  <a
                    href={event.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-1 px-6 py-3 bg-[#b46b35] text-white font-medium rounded-full hover:bg-[#a06133] transition-colors text-sm"
                  >
                    Learn More & Apply
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
