export default function JoinPage() {
  return (
    <main className="min-h-screen bg-[#d2c3b3] text-[#2e2b28] font-sans antialiased">
      {/* Hero Section */}
      <section className="py-24 px-6 text-center">
      <h1 className="md:text-5xl font-serif font-bold tracking-tight mb-5">
            Join <span className="text-[#d3624e]">Princeton Quantitative Traders</span>
          </h1>
        <p className="text-lg text-[#5c5045] max-w-2xl mx-auto leading-relaxed mb-10">
          Become part of a community of Princeton students who share curiosity, rigor, and collaboration.
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

      {/* Membership Requirements */}
      <section className="max-w-5xl mx-auto px-6 py-5 border-t border-[#c3b6aa]">
        <h2 className="text-3xl font-semibold text-center mb-16 tracking-tight">
          Membership Requirements
        </h2>
        <div className="space-y-16">
          <div className="bg-[#e9e1d9] rounded-3xl p-10 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-2xl font-serif font-semibold mb-4">Academic Requirements</h3>
            <ul className="space-y-3 text-lg text-[#5c5045]">
              <li>Currently enrolled undergraduate or graduate student at Princeton University</li>
              <li>Interest in quantitative finance and applied mathematics</li>
              <li>Commitment to participate in club activities and research projects</li>
            </ul>
          </div>

          <div className="bg-[#e9e1d9] rounded-3xl p-10 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-2xl font-serif font-semibold mb-4">Club Expectations</h3>
            <ul className="space-y-3 text-lg text-[#5c5045]">
              <li>Actively engage in events and project based learning</li>
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
          pqt@princeton.edu &nbsp; | &nbsp; Campus Group: Princeton Quantitative Traders
        </p>
      </section>
    </main>
  );
}
