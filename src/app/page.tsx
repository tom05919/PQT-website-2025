import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-neutral-100 min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-neutral-05 mb-6">
            Princeton
            <span className="block text-bright">Quantitative Traders</span>
          </h1>
          <p className="text-xl md:text-2xl text-neutral-60 max-w-4xl mx-auto mb-8">
            Princeton's only Quantitative Trading Club. Working to bridge theory with practical application, placing Princetonians into Quant Trading and Research roles throughout industry.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/join"
              className="bg-bright text-neutral-100 px-8 py-4 text-lg font-semibold hover:bg-bright-light hover:text-neutral-100 transition-colors duration-200"
            >
              Join Our Club
            </Link>
            <Link
              href="/about"
              className="border border-bright text-bright px-8 py-4 rounded-full text-lg font-semibold hover:bg-bright hover:text-neutral-100 transition-colors duration-200"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-neutral-90">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-neutral-05 text-center mb-12">
            What we do
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
                          {
              title: "Interview Preparation",
              description: "Weekly sessions focused on problem solving skills, mock interviews with peers, and outside mentorship from companies and alumni",
            },
            {
              title: "Projects",
              description: "Build your own trading models, data, and more through our weekly project series",
            },
            {
              title: "Trading Competitions",
              description: "Form teams to participate in trading competitions and win prizes",
            }
            ].map((feature, index) => (
              <div key={index} className="bg-neutral-85 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-neutral-05 mb-3">{feature.title}</h3>
                <p className="text-neutral-60">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research & Learning Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-neutral-05 mb-6">
                Research & Learning
              </h2>
              <p className="text-neutral-60 text-lg mb-6">
                Our club provides hands-on experience in quantitative finance through 
                original research projects, interview preparation, and collaborative learning 
                with fellow Princeton students.
              </p>
              <ul className="space-y-3 text-neutral-60 mb-8">
                <li className="flex items-start">
                  <span className="text-bright mr-3">•</span>
                  Original research in quantitative analysis
                </li>
                <li className="flex items-start">
                  <span className="text-bright mr-3">•</span>
                  Interview preparation for top firms
                </li>
                <li className="flex items-start">
                  <span className="text-bright mr-3">•</span>
                  Trading competition participation
                </li>
                <li className="flex items-start">
                  <span className="text-bright mr-3">•</span>
                  Community of passionate students
                </li>
              </ul>
              <Link
                href="/about"
                className="bg-bright text-neutral-100 px-8 py-3 rounded-full font-semibold hover:bg-bright-light hover:text-neutral-100 transition-colors duration-200"
              >
                Learn More
              </Link>
            </div>
            <div className="bg-neutral-90 rounded-2xl p-8 shadow-md">
              <div className="text-center">
                <div className="text-6xl mb-4">🔬</div>
                <h3 className="text-xl font-semibold text-neutral-05 mb-4">Research Focus</h3>
                <div className="space-y-3 text-sm text-neutral-60">
                  <div className="flex justify-between">
                    <span>Research Areas:</span>
                    <span className="text-bright">Quantitative Analysis</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Members:</span>
                    <span className="text-bright">Princeton Students</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Focus:</span>
                    <span className="text-bright">Applied Mathematics</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Goal:</span>
                    <span className="text-bright">Career Preparation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-neutral-90">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-neutral-05 mb-6">
            Ready to Start Your Trading Journey?
          </h2>
          <p className="text-neutral-60 text-lg mb-8">
            Join our community of passionate traders and take your skills to the next level. 
            Whether you&apos;re a beginner or have some experience, we have something for everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/join"
              className="bg-bright text-neutral-100 px-8 py-4 rounded-full text-lg font-semibold hover:bg-bright-light hover:text-neutral-100 transition-colors duration-200"
            >
              Become a Member
            </Link>
            <Link
              href="/about"
              className="border border-bright text-bright px-8 py-4 rounded-full text-lg font-semibold hover:bg-bright hover:text-neutral-100 transition-colors duration-200"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
