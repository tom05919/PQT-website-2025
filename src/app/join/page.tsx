export default function JoinPage() {
  return (
    <main className="min-h-screen bg-[#d2c3b3] text-[#2e2b28] font-sans antialiased">
      {/* Hero Section */}
      <section className="py-24 px-6 text-center">
        <h1 className="text-5xl font-semibold mb-4 tracking-tight">
          Join Princeton Quantitative Traders
        </h1>
        <p className="text-lg text-[#5c5045] max-w-2xl mx-auto leading-relaxed mb-10">
          Ready to explore the world of quantitative finance and applied mathematics? Become part of
          a community of Princeton students who share curiosity, rigor, and collaboration.
        </p>
        <a
          href="https://docs.google.com/forms/d/1Q6CNYd_oekxA043g30jHWzbNC6qtgB-muzVjNrvJw4U/edit"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-[#a87445] text-[#f8f4ef] px-8 py-4 rounded-full text-lg font-medium hover:bg-[#946b3c] transition-colors"
        >
          Apply Now
        </a>
      </section>

      {/* Why Join Section */}
      <section className="max-w-5xl mx-auto px-6 py-24 border-t border-[#c3b6aa]">
        <h2 className="text-3xl font-semibold text-center mb-16 tracking-tight">
          Why Join Our Club?
        </h2>
        <div className="space-y-16">
          {[
            {
              title: "Interview Preparation",
              description:
                "Gain hands-on practice and insight into the quantitative trading interview process through guided problem-solving and peer review.",
            },
            {
              title: "Research & Projects",
              description:
                "Collaborate on original projects that explore statistical modeling, market data, and trading simulations with real applications.",
            },
            {
              title: "Competitions & Teamwork",
              description:
                "Join teams representing Princeton in national quantitative trading and finance competitions.",
            },
            {
              title: "Community & Mentorship",
              description:
                "Build lasting relationships with peers, mentors, and alumni passionate about data-driven thinking.",
            },
          ].map((benefit, index) => (
            <div
              key={index}
              className="bg-[#e9e1d9] rounded-3xl p-10 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <h3 className="text-2xl font-semibold mb-3">{benefit.title}</h3>
              <p className="text-[#5c5045] text-lg leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Membership Requirements */}
      <section className="max-w-5xl mx-auto px-6 py-24 border-t border-[#c3b6aa]">
        <h2 className="text-3xl font-semibold text-center mb-16 tracking-tight">
          Membership Requirements
        </h2>
        <div className="space-y-16">
          <div className="bg-[#e9e1d9] rounded-3xl p-10 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-2xl font-semibold mb-4">Academic Requirements</h3>
            <ul className="space-y-3 text-lg text-[#5c5045]">
              <li>Currently enrolled undergraduate or graduate student at Princeton University</li>
              <li>Interest in quantitative finance and applied mathematics</li>
              <li>Commitment to participate in club activities and research projects</li>
              <li>Open to all majors — no prior trading experience required</li>
            </ul>
          </div>

          <div className="bg-[#e9e1d9] rounded-3xl p-10 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-2xl font-semibold mb-4">Club Expectations</h3>
            <ul className="space-y-3 text-lg text-[#5c5045]">
              <li>Actively engage in research and project-based learning</li>
              <li>Participate in interview preparation and trading competitions</li>
              <li>Contribute to the collaborative culture of the club</li>
              <li>Maintain academic integrity and professionalism</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-[#c3b6aa] py-24 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-4 tracking-tight">Ready to Get Started?</h2>
        <p className="text-[#4b4138] max-w-xl mx-auto mb-10 leading-relaxed">
          Take your first step into quantitative trading, data-driven research, and a welcoming
          academic community.
        </p>
        <a
          href="https://docs.google.com/forms/d/1Q6CNYd_oekxA043g30jHWzbNC6qtgB-muzVjNrvJw4U/edit"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-[#a87445] text-[#f8f4ef] px-8 py-4 rounded-full text-lg font-medium hover:bg-[#946b3c] transition-colors"
        >
          Start Application
        </a>
      </section>

      {/* Contact Info */}
      <section className="py-20 px-6 text-center border-t border-[#c3b6aa]">
        <h3 className="text-2xl font-semibold mb-4">Questions?</h3>
        <p className="text-[#5c5045] mb-4">
          Reach out to our membership team for more information.
        </p>
        <p className="text-[#5c5045] text-lg">
          pqt@princeton.edu &nbsp; | &nbsp; Discord: Princeton Quantitative Traders
        </p>
      </section>
    </main>
  );
}
