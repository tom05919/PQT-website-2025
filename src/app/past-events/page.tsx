'use client';

import Link from 'next/link';

interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  materials?: Array<{
    name: string;
    url: string;
  }>;
}

const events: Event[] = [
  {
    id: '3',
    title: 'PQT Project Series',
    date: 'October 22, 2025',
    description:
      'A showcase of our ongoing projects — from algorithmic research to data-driven experiments. Explore and contribute via our open GitHub repository.',
    materials: [
      {
        name: 'Project GitHub Link',
        url: 'https://github.com/charlespers/PQT_Education_Series_25-26',
      },
    ],
  },
  {
    id: '1',
    title: 'PQT Education Series – Probabilities',
    date: 'September 25, 2025',
    description:
      'An introduction to the probability theories commonly used in quantitative finance, connecting mathematical ideas with practical intuition.',
    materials: [
      { name: 'Beginner Slides', url: '/documents/pqt_ed_series_beginner.pdf' },
      { name: 'Advanced Slides', url: '/documents/pqt_ed_series_advanced.pdf' },
    ],
  },
  {
    id: '2',
    title: 'Princeton Quantitative Traders Info Session',
    date: 'September 12, 2025',
    description:
      'An overview of the Princeton Quantitative Traders club, our mission, and upcoming initiatives for the semester.',
    materials: [
      { name: 'Presentation Slides', url: '/documents/pqt-info-session.pdf' },
    ],
  },
];

export default function PastEvents() {
  return (
    <main className="min-h-screen bg-[#d1c3b3] text-[#2e2b28] font-sans antialiased">
      {/* Hero Section */}
      <section className="py-24 px-6 text-center">
        <h1 className="text-5xl md:text-6xl font-serif font-bold tracking-tight mb-6">
          Past <span className="text-[#d26b2c]">Events</span>
        </h1>
        <p className="text-lg text-[#5c5045] max-w-2xl mx-auto leading-relaxed">
          A look back at the sessions, projects, and discussions of our club.
        </p>
      </section>

      {/* Events */}
      <section className="max-w-5xl mx-auto px-6 space-y-20 pb-32">
        {events.map((event) => (
          <div
            key={event.id}
            className="relative bg-[#a36843] rounded-3xl shadow-sm border border-[#3c2e26] px-8 py-12 hover:shadow-md transition-shadow duration-300"
          >
            <div className="absolute -top-5 left-8 bg-[#d26b2c] text-[#fff7f0] text-sm px-4 py-1 rounded-full font-serif font-medium tracking-wide">
              {event.date}
            </div>

            <h2 className="text-3xl font-serif font-semibold mb-4 text-[#fff7f0]">
              {event.title}
            </h2>

            <p className="text-[#e3d9d0] text-lg leading-relaxed mb-8 max-w-3xl">
              {event.description}
            </p>

            {event.materials && event.materials.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {event.materials.map((m, index) => (
                  <Link
                    key={index}
                    href={m.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-[#7b6354] hover:bg-[#6b5547] text-[#f8f4ef] rounded-full px-5 py-3 transition-colors text-sm font-medium"
                  >
                    {m.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </section>

      {/* CTA Section */}
      <section className="bg-[#c3b6aa] py-24 px-6 text-center">
        <h2 className="text-3xl font-serif font-semibold mb-4 tracking-tight">Stay Connected</h2>
        <p className="text-[#4b4138] max-w-xl mx-auto mb-10 leading-relaxed">
          Be the first to hear about new projects, workshops, and education sessions — join our
          community today.
        </p>
        <Link
          href="/join"
          className="inline-block bg-[#a87445] text-[#f8f4ef] px-8 py-4 rounded-full text-lg font-medium hover:bg-[#946b3c] transition-colors"
        >
          Join Our Club
        </Link>
      </section>
    </main>
  );
}
