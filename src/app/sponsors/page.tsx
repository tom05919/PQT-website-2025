import Image from 'next/image';

export default function SponsorsPage() {
  return (
    <div className="bg-neutral-100 min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-neutral-05 mb-6">
            Our Sponsors
          </h1>
          <p className="text-xl text-neutral-60 max-w-3xl mx-auto">
            We're grateful for the support of our sponsors who help make our club activities 
            and educational programs possible.
          </p>
        </div>
      </section>

      {/* Gold Sponsors Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-05 mb-4">Gold Sponsors</h2>
            <p className="text-neutral-60">Our premier partners who provide exceptional support</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Citadel",
                description: "Our mission is to be the most successful investment team in the world. We've assembled world-class talent in order to achieve it.",
                logo: "/images/citadel-logo.jpg",
                tier: "Gold Sponsor"
              },
              {
                name: "Jane Street",
                description: "Jane Street is a research-driven trading firm where curious people work together on deep problems.",
                logo: "/images/jane-street-logo.png",
                tier: "Gold Sponsor"
              },
              {
                name: "Hudson River Trading",
                description: "We are engineers and researchers working as one team to solve difficult problems, and trading millions of shares a day on the world's financial markets.",
                logo: "/images/hrt-logo.svg",
                tier: "Gold Sponsor"
              },
              {
                name: "Five Rings",
                description: "Five Rings is a team-first meritocracy built on constant innovation, where motivated, highly analytical individuals can thrive in almost any direction.",
                logo: "/images/five-rings-logo.jpeg",
                tier: "Gold Sponsor"
              },
              {
                name: "D.E. Shaw",
                description: "The firm prizes a culture of collaboration across disciplines, geographies, and investment strategies. Analytical rigor, an open exploration of ideas, and a relentless pursuit of excellence drive us forward.",
                logo: "/images/DEShaw-logo.jpg",
                tier: "Gold Sponsor"
              }
            ].map((sponsor, index) => (
              <div 
                key={index} 
                className="bg-gradient-to-br from-neutral-90 to-neutral-85 rounded-2xl p-8 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group cursor-pointer border border-bright/20"
              >
                <div className="text-center">
                  {/* Logo */}
                  <div className="w-40 h-24 flex items-center justify-center mx-auto mb-6">
                    <Image
                      src={sponsor.logo}
                      alt={`${sponsor.name} Logo`}
                      width={160}
                      height={96}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-05 mb-4 group-hover:text-bright transition-colors">
                    {sponsor.name}
                  </h3>
                  <p className="text-neutral-60 text-sm group-hover:text-neutral-40 transition-colors">
                    {sponsor.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Silver Sponsors Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-neutral-90">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-05 mb-4">Silver Sponsors</h2>
            <p className="text-neutral-60">Our valued partners supporting our mission</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Tower Research",
                description: "Powered by a high-performance technology platform, Tower is home to the world's best quantitative trading teams.",
                logo: "/images/tower-logo.svg",
                tier: "Silver Sponsor"
              }
            ].map((sponsor, index) => (
              <div 
                key={index} 
                className="bg-neutral-85 rounded-2xl p-6 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 group cursor-pointer"
              >
                <div className="text-center">
                  {/* Logo */}
                  <div className="w-32 h-20 flex items-center justify-center mx-auto mb-4">
                    <Image
                      src={sponsor.logo}
                      alt={`${sponsor.name} Logo`}
                      width={128}
                      height={80}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-05 mb-3 group-hover:text-neutral-10 transition-colors">
                    {sponsor.name}
                  </h3>
                  <p className="text-neutral-60 text-sm group-hover:text-neutral-50 transition-colors">
                    {sponsor.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Become a Sponsor CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-neutral-90">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-neutral-05 mb-6">
            Interested in Sponsoring Our Club?
          </h2>
          <p className="text-neutral-60 text-lg mb-8">
            Join our community of sponsors and help us provide valuable educational 
            opportunities to the next generation of traders and financial professionals.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <a 
              href="/documents/sponsorship-package.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto border border-bright text-bright px-8 py-3 rounded-full font-semibold hover:bg-bright hover:text-neutral-100 transition-colors duration-200 inline-block text-center"
            >
              View Sponsorship Tiers
            </a>
          </div>
        </div>
      </section>

      {/* Sponsor Tiers Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-neutral-05 text-center mb-12">
            Sponsor Tiers & Benefits
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Gold Tier */}
            <div className="bg-gradient-to-br from-neutral-90 to-neutral-85 rounded-2xl p-8 border border-bright/20">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-bright rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-neutral-100 font-bold text-2xl">🥇</span>
                </div>
                <h3 className="text-2xl font-bold text-neutral-05 mb-2">Gold Sponsors</h3>
                <p className="text-bright font-semibold">Premium Partnership</p>
              </div>
              <ul className="space-y-3 text-neutral-60">
                <li className="flex items-start">
                  <span className="text-bright mr-3">•</span>
                  Large logo placement on website and all materials
                </li>
                <li className="flex items-start">
                  <span className="text-bright mr-3">•</span>
                  Priority access to top-performing students
                </li>
                <li className="flex items-start">
                  <span className="text-bright mr-3">•</span>
                  Exclusive networking events and mixers
                </li>
                <li className="flex items-start">
                  <span className="text-bright mr-3">•</span>
                  Speaking opportunities at major events
                </li>
                <li className="flex items-start">
                  <span className="text-bright mr-3">•</span>
                  Custom workshop and training sessions
                </li>
                <li className="flex items-start">
                  <span className="text-bright mr-3">•</span>
                  Direct mentorship program access
                </li>
              </ul>
            </div>

            {/* Silver Tier */}
            <div className="bg-neutral-90 rounded-2xl p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-neutral-60 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-neutral-100 font-bold text-2xl">🥈</span>
                </div>
                <h3 className="text-2xl font-bold text-neutral-05 mb-2">Silver Sponsors</h3>
                <p className="text-neutral-60 font-semibold">Supporting Partnership</p>
              </div>
              <ul className="space-y-3 text-neutral-60">
                <li className="flex items-start">
                  <span className="text-neutral-60 mr-3">•</span>
                  Logo placement on website and select materials
                </li>
                <li className="flex items-start">
                  <span className="text-neutral-60 mr-3">•</span>
                  Access to student talent pool
                </li>
                <li className="flex items-start">
                  <span className="text-neutral-60 mr-3">•</span>
                  Invitation to networking events
                </li>
                <li className="flex items-start">
                  <span className="text-neutral-60 mr-3">•</span>
                  Opportunity to present at workshops
                </li>
                <li className="flex items-start">
                  <span className="text-neutral-60 mr-3">•</span>
                  Company information sessions
                </li>
                <li className="flex items-start">
                  <span className="text-neutral-60 mr-3">•</span>
                  Newsletter and communication updates
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
