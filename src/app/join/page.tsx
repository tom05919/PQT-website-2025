export default function JoinPage() {
  return (
    <div className="bg-neutral-100 min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-neutral-05 mb-6">
            Join Princeton Quantitative Traders
          </h1>
          <p className="text-xl text-neutral-60 max-w-3xl mx-auto mb-8">
            Ready to dive into quantitative finance and applied mathematics? Join our community of 
            Princeton students passionate about quantitative trading and research.
          </p>
          <a 
            href="https://docs.google.com/forms/d/1Q6CNYd_oekxA043g30jHWzbNC6qtgB-muzVjNrvJw4U/edit"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-bright text-neutral-100 px-8 py-4 rounded-full text-lg font-semibold hover:bg-bright-light hover:text-neutral-100 transition-colors duration-200"
          >
            Apply Now
          </a>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-neutral-90">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-neutral-05 text-center mb-12">
            Why Join Our Club?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Interview Preparation",
                description: "Gain practical experience for quantitative trading interview processes",
                icon: "🎯"
              },
              {
                title: "Research Projects",
                description: "Conduct original research projects related to quantitative analysis",
                icon: "🔬"
              },
              {
                title: "Trading Competitions",
                description: "Form teams to participate in trading competitions",
                icon: "🏆"
              },
              {
                title: "Community Building",
                description: "Connect with fellow Princeton students interested in quantitative finance",
                icon: "🤝"
              },
              {
                title: "Career Development",
                description: "Access to internships and job opportunities at top quantitative firms",
                icon: "💼"
              },
              {
                title: "Academic Support",
                description: "Collaborative learning environment for applied mathematics and finance",
                icon: "📚"
              }
            ].map((benefit, index) => (
              <div key={index} className="bg-neutral-85 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold text-neutral-05 mb-3">{benefit.title}</h3>
                <p className="text-neutral-60">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-neutral-05 text-center mb-12">
            Membership Requirements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-neutral-90 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-neutral-05 mb-4">Academic Requirements</h3>
              <ul className="space-y-3 text-neutral-60">
                <li className="flex items-start">
                  <span className="text-bright mr-3">•</span>
                  Currently enrolled undergraduate or graduate student at Princeton University
                </li>
                <li className="flex items-start">
                  <span className="text-bright mr-3">•</span>
                  Interest in quantitative finance and applied mathematics
                </li>
                <li className="flex items-start">
                  <span className="text-bright mr-3">•</span>
                  Commitment to participate in club activities and research projects
                </li>
                <li className="flex items-start">
                  <span className="text-bright mr-3">•</span>
                  Open to all majors - no prior trading experience required
                </li>
              </ul>
            </div>
            <div className="bg-neutral-90 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-neutral-05 mb-4">Club Expectations</h3>
              <ul className="space-y-3 text-neutral-60">
                <li className="flex items-start">
                  <span className="text-bright mr-3">•</span>
                  Participate in research projects and interview preparation
                </li>
                <li className="flex items-start">
                  <span className="text-bright mr-3">•</span>
                  Join trading competition teams when available
                </li>
                <li className="flex items-start">
                  <span className="text-bright mr-3">•</span>
                  Contribute to the quantitative finance community at Princeton
                </li>
                <li className="flex items-start">
                  <span className="text-bright mr-3">•</span>
                  Maintain academic excellence and professional conduct
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-neutral-05 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-neutral-60 text-lg mb-8">
            Don&apos;t miss out on this opportunity to develop your trading skills and 
            connect with fellow finance enthusiasts. Apply today!
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <a 
              href="https://docs.google.com/forms/d/1Q6CNYd_oekxA043g30jHWzbNC6qtgB-muzVjNrvJw4U/edit"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-bright text-neutral-100 px-8 py-4 rounded-full text-lg font-semibold hover:bg-bright-light hover:text-neutral-100 transition-colors duration-200"
            >
              Start Application
            </a>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-neutral-90">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-xl font-semibold text-neutral-05 mb-4">Questions?</h3>
          <p className="text-neutral-60 mb-4">
            Contact our membership team for more information
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-8 text-sm text-neutral-60">
            <span>📧 pqt@princeton.edu</span>
            <span>💬 Discord: Princeton Quantitative Traders</span>
          </div>
        </div>
      </section>
    </div>
  );
}
