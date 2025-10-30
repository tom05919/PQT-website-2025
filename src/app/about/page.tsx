export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#d2c3b3] text-[#2e2b28] font-sans antialiased">
      {/* Hero Section */}
      <section className="py-28 px-6 sm:px-10 lg:px-16 border-b border-[#c0ae9f]/50">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold tracking-tight mb-6">
            About <span className="text-[#d26b2c]">Princeton Quantitative Traders</span>
          </h1>
          <p className="text-lg md:text-xl text-[#463f3a] max-w-3xl mx-auto leading-relaxed">
            We’re a community of Princeton students exploring quantitative finance, data, and applied mathematics - 
            from all backgrounds, majors, and class years.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 px-6 sm:px-10 lg:px-16 border-b border-[#c0ae9f]/50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <h3 className="text-3xl font-serif font-semibold mb-3">Our Mission</h3>
            <p className="text-[#463f3a] text-lg mb-1 leading-relaxed">
              Princeton Quantitative Traders was founded to solve the bifurcation of theory learned 
              at Princeton to industry application.
              </p>
            <p className="text-[#463f3a] text-lg mb-4 leading-relaxed">
              Thus, our mission is to cultivate a space for members to apply theoretical ideas
              into practice. Our main areas of interest are in mathematics, programming, and reasoning. 
            
              We’re open to all Princeton students, regardless of background and hope to
              emphasize collaberation over competition.
            </p>
          </div>
          <div className="bg-[#d8c6b8] rounded-2xl p-8">
            <h3 className="text-3xl font-serif font-semibold mb-3">What We Do</h3>
            <ul className="space-y-3 text-[#463f3a]">
              {[
                "Weekly interview preperation for quantitative trading positions. Sessions are held on Thursdays at 8:00pm, more information on location and content can be found on listserv or our GroupMe.",
                "Weekly project sessions focused on understanding market structure and how to interpret data within a trading system. Project sessions are held on Wednesdays at 9:00pm, more information on location and content can be found on listserv or our GroupMe.",
                "National trading competitions hosted each semester with opportunities to win prizes and network with industry professionals. ",
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

      {/* Events Section */}
      <section className="py-24 px-6 sm:px-10 lg:px-16 border-b border-[#bda89a]/40">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-serif font-semibold text-center mb-12">Upcoming Events</h2>
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
                <h3 className="text-2xl font-serif font-semibold text-[#2e2b28] mb-2">{event.title}</h3>
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
          <h2 className="text-3xl font-serif font-semibold text-center mb-12">Past Events</h2>
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
                <h3 className="text-2xl font-serif font-semibold text-[#2e2b28] mb-2">{event.title}</h3>
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
