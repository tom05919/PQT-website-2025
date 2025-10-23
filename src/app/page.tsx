import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#d2c3b3] text-[#2e2b28] font-sans antialiased">
      {/* Hero Section */}
      <section className="px-6 sm:px-10 lg:px-16 py-28 border-b border-[#e2dcd6]">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold tracking-tight mb-6">
            Princeton <span className="text-[#d26b2c]">Quantitative Traders</span>
          </h1>
          <p className="text-lg text-[#4c4742] max-w-2xl mx-auto leading-relaxed mb-10">
            Bridging Princeton’s academic excellence with the practical world of
            quantitative trading — through research, mentorship, and community.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/join"
              className="bg-[#d26b2c] text-white px-8 py-3.5 rounded-full font-medium hover:bg-[#bb5e27] transition-colors"
            >
              Join Our Club
            </Link>
            <Link
              href="/about"
              className="text-[#d26b2c] border border-[#d26b2c] px-8 py-3.5 rounded-full font-medium hover:bg-[#d26b2c] hover:text-white transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="px-6 sm:px-10 lg:px-16 py-24 border-b border-[#e2dcd6]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-serif font-semibold mb-3">
              What We Do
            </h2>
            <p className="text-[#4c4742] max-w-2xl">
              Our programs combine quantitative theory, market practice, and
              collaborative learning — forming a pathway from campus to career.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: "Interview Preparation",
                description:
                  "Hands-on sessions in problem-solving, mock interviews, and guidance from alumni working at leading firms.",
              },
              {
                title: "Research & Projects",
                description:
                  "Collaborate on quantitative research projects and develop your own trading strategies with real data.",
              },
              {
                title: "Competitions",
                description:
                  "Team up with peers to compete in national trading competitions — a real-world test of your quant skills.",
              },
            ].map((item, i) => (
              <div key={i} className="space-y-3">
                <h3 className="text-xl font-semibold font-serif text-[#2e2b28]">
                  {item.title}
                </h3>
                <p className="text-[#4c4742] leading-relaxed text-[15px]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research Section */}
      <section className="px-6 sm:px-10 lg:px-16 py-24 border-b border-[#e2dcd6]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-serif font-semibold mb-4">
              Research & Learning
            </h2>
            <p className="text-[#4c4742] text-lg mb-8 leading-relaxed">
              From theoretical models to practical trading systems, our members
              explore every layer of quantitative finance. Collaboration and
              mentorship form the foundation of our learning.
            </p>
            <ul className="space-y-2 text-[#4c4742] mb-8">
              {[
                "Original research in quantitative analysis",
                "Interview preparation for top firms",
                "Participation in trading competitions",
                "Community of analytical thinkers",
              ].map((item, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-[#d26b2c] mr-3 text-lg">•</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/about"
              className="inline-block bg-[#d26b2c] text-white px-8 py-3 rounded-full font-medium hover:bg-[#bb5e27] transition-colors"
            >
              Learn More
            </Link>
          </div>

          <div className="border-l-2 border-[#d26b2c]/20 pl-10">
            <h3 className="text-xl font-semibold font-serif mb-4">
              Research Focus
            </h3>
            <dl className="space-y-3 text-[#4c4742]">
              <div className="flex justify-between">
                <dt>Area</dt>
                <dd className="font-medium text-[#d26b2c]">
                  Quantitative Analysis
                </dd>
              </div>
              <div className="flex justify-between">
                <dt>Members</dt>
                <dd className="font-medium text-[#d26b2c]">
                  Princeton Students
                </dd>
              </div>
              <div className="flex justify-between">
                <dt>Focus</dt>
                <dd className="font-medium text-[#d26b2c]">
                  Applied Mathematics
                </dd>
              </div>
              <div className="flex justify-between">
                <dt>Goal</dt>
                <dd className="font-medium text-[#d26b2c]">
                  Career Preparation
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 sm:px-10 lg:px-16 py-24 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-serif font-semibold mb-4">
            Ready to Begin Your Trading Journey?
          </h2>
          <p className="text-[#4c4742] text-lg mb-8 leading-relaxed">
            Join a community of analytical thinkers who bring theory to life
            through research, teamwork, and curiosity.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/join"
              className="bg-[#d26b2c] text-white px-8 py-3 rounded-full font-medium hover:bg-[#bb5e27] transition-colors"
            >
              Become a Member
            </Link>
            <Link
              href="/about"
              className="border border-[#d26b2c] text-[#d26b2c] px-8 py-3 rounded-full font-medium hover:bg-[#d26b2c] hover:text-white transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
