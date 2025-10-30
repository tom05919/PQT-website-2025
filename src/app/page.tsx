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
          <p className="text-lg text-[#4c4742] leading-relaxed mb-10">
          Official Princeton University Quantitative Trading Club
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/join"
              className="bg-[#d26b2c] text-white px-4 py-3.5 rounded-full font-medium hover:bg-[#825c45] transition-colors"
            >
              Join Our Club
            </Link>
            <Link
              href="/about"
              className="text-[#d26b2c] border border-[#d26b2c] px-4 py-3.5 rounded-full font-medium hover:bg-[#d26b2c] hover:text-white transition-colors"
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
              Our goal is to bridge theory in classes with practical projects, 
              advice, and real world settings to simulate pressure and force real
              world decision making processes.
              
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: "Interview Preparation",
                description:
                  "Hands on problem solving sessions, mock interviews, and guidance from alumni working at leading firms.",
              },
              {
                title: "Research & Projects",
                description:
                  "Collaberate on trading strategies and build your own models through weekly projecting sessions.",
              },
              {
                title: "Competitions",
                description:
                  "Team up with peers to compete in national trading competitions.",
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

      {/* Officers Section */}
      <section className="py-24 px-6 sm:px-10 lg:px-16 bg-[#cbb6a6] border-b border-[#bda89a]/40">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-serif font-semibold mb-3">Meet Our Officers</h2>
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
                  <h3 className="text-lg font-serif font-semibold text-[#2e2b28] group-hover:text-[#b46b35] transition-colors">
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

      {/* Research Section */}
      <section className="px-6 sm:px-10 lg:px-16 py-24 border-b border-[#e2dcd6]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-serif font-semibold mb-4">
              Research & Learning
            </h2>
            <p className="text-[#4c4742] text-lg mb-4 leading-relaxed">
              From theoretical models to practical trading systems, our members explore different
              layers of quantitative structure. Collaberation and mentorship drive our learning.
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
              Current Programs
            </h3>
            <dl className="space-y-3 text-[#4c4742]">
              <div className="flex justify-between">
                <dt>Weekly Project Sessions (Machine Learning and Research)</dt>
                <dd className="font-medium text-[#d26b2c]">
                  Wednesdays 9:00pm
                </dd>
              </div>
              <div className="flex justify-between">
                <dt>Weekly Interview Preperation Sessions</dt>
                <dd className="font-medium text-[#d26b2c]">
                  Thursdays 8:00pm
                </dd>
                </div>
                <div className = "flex justify-between">
                <Link href = "https://docs.google.com/forms/d/e/1FAIpQLSctc8kj4kSqcGILcnSzHVq91J1wlUO0bfZ0ZUYuy64_JxoLPA/viewform"
                      className="inline-block bg-[#d26b2c] justify-center text-white px-4 py-1 rounded-full font-small hover:bg-[#bb5e27] transition-colors"
                >
                  Sign Up for COSCON
                </Link>
                </div>
              <div className="flex justify-between">
                <dt>COSCONxPQT</dt>
                <dd className="font-medium text-[#d26b2c]">
                  November 16th
                </dd>
              </div>
              <div className="flex justify-between">
                <dt>Fall Trading Competition</dt>
                <dd className="font-medium text-[#d26b2c]">
                  November 22nd
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
            Want to join?
          </h2>
          <p className="text-[#4c4742] text-lg mb-8 leading-relaxed">
            Interested in Joining a Community of Like Minded Peers, Applying theory 
            to Practice Through Real World Projects, or Competing in National Trading 
            competitions?
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
