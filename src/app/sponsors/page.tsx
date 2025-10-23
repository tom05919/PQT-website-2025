import Image from 'next/image';

export default function SponsorsPage() {
  return (
    <main className="bg-[#3b2b21] text-[#f3ede5] font-sans antialiased">
      {/* Hero */}
      <section className="py-28 px-6 sm:px-10 lg:px-16 text-center">
        <h1 className="text-5xl md:text-6xl font-semibold mb-6 tracking-tight">
          Our <span className="text-[#d98c45]">Sponsors</span>
        </h1>
        <p className="text-lg md:text-xl text-[#d5c7b8] max-w-3xl mx-auto leading-relaxed">
          We’re deeply grateful to the organizations that fuel our mission —
          fostering growth, curiosity, and community.
        </p>
      </section>

      {/* Sponsors Gallery */}
      <section className="py-20 px-6 sm:px-10 lg:px-16 bg-[#4a3a2b]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-[#f3ede5] mb-3">
              Gold Sponsors
            </h2>
            <p className="text-[#d5c7b8]">
              Our premier partners whose collaboration powers everything we do.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                name: 'Citadel',
                description:
                  'A global leader in investment and risk management, empowering analytical minds to solve hard problems.',
                logo: '/images/citadel-logo.jpg',
              },
              {
                name: 'Jane Street',
                description:
                  'A research-driven trading firm where curiosity and collaboration drive innovation.',
                logo: '/images/jane-street-logo.png',
              },
              {
                name: 'Hudson River Trading',
                description:
                  'Engineers and researchers united to build technology for the world’s financial markets.',
                logo: '/images/hrt-logo.svg',
              },
              {
                name: 'Five Rings',
                description:
                  'A team-first meritocracy built on innovation, curiosity, and rapid problem-solving.',
                logo: '/images/five-rings-logo.jpeg',
              },
              {
                name: 'D.E. Shaw',
                description:
                  'A global investment and technology firm driven by analytical rigor and open exploration of ideas.',
                logo: '/images/DEShaw-logo.jpg',
              },
            ].map((sponsor, i) => (
              <div
                key={i}
                className="rounded-3xl bg-[#3a2c22] border border-[#5b4939] p-8 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="text-center">
                  <div className="w-40 h-24 flex items-center justify-center mx-auto mb-6">
                    <Image
                      src={sponsor.logo}
                      alt={`${sponsor.name} Logo`}
                      width={160}
                      height={96}
                      className="object-contain max-w-full max-h-full"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[#f3ede5]">
                    {sponsor.name}
                  </h3>
                  <p className="text-[#d5c7b8] text-sm leading-relaxed">
                    {sponsor.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Silver Sponsors */}
      <section className="py-20 px-6 sm:px-10 lg:px-16 bg-[#3b2b21] border-t border-[#5b4939]">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-3 text-[#f3ede5]">
            Silver Sponsors
          </h2>
          <p className="text-[#d5c7b8] mb-12">
            Our valued partners supporting our growth and initiatives.
          </p>

          <div className="flex flex-wrap justify-center gap-10">
            <div className="rounded-3xl bg-[#3a2c22] border border-[#5b4939] p-8 shadow-sm hover:shadow-md transition-all duration-300 max-w-sm">
              <div className="w-32 h-20 flex items-center justify-center mx-auto mb-5">
                <Image
                  src="/images/tower-logo.svg"
                  alt="Tower Research Logo"
                  width={128}
                  height={80}
                  className="object-contain"
                />
              </div>
              <h3 className="text-lg font-semibold text-[#f3ede5] mb-2">
                Tower Research
              </h3>
              <p className="text-sm text-[#d5c7b8] leading-relaxed">
                Tower is a technology-driven trading firm where teams innovate
                and compete on the world’s markets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 sm:px-10 lg:px-16 text-center bg-[#2a2018] border-t border-[#5b4939]">
        <h2 className="text-3xl font-semibold mb-6 text-[#f3ede5]">
          Interested in <span className="text-[#d98c45]">Sponsoring</span> Our Club?
        </h2>
        <p className="text-lg text-[#d5c7b8] max-w-2xl mx-auto mb-10 leading-relaxed">
          Join our network of sponsors and help us empower Princeton students to
          explore quantitative research, trading, and finance with purpose.
        </p>
        <a
          href="/documents/sponsorship-package.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-3 bg-[#d98c45] text-white font-medium rounded-full hover:bg-[#c27c3e] transition-colors duration-200 shadow-sm"
        >
          View Sponsorship Tiers
        </a>
      </section>
    </main>
  );
}
