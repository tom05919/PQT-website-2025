'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  slideshow?: string;
  materials?: Array<{
    name: string;
    url: string;
    type: 'slideshow' | 'document' | 'video' | 'other';
  }>;
}

const events: Event[] = [
  {
    id: 'PQT Education Series - Probabilites',
    title: 'PQT Education Series - Probabilites',
    date: '9/25/2025',
    description: 'Introduction to the probabily theories that is commonly used in quant fiance.',
    materials: [
      {
        name: 'Beginner slides',
        url: '/documents/pqt_ed_series_beginner.pdf',
        type: 'slideshow'
      },
      {
        name: 'Advanced slides',
        url: '/documents/pqt_ed_series_advanced.pdf',
        type: 'slideshow'
      }
    ]
  },
  {
    id: 'Princeton Quantitative Traders Info Session',
    title: 'Princeton Quantitative Traders Info Session',
    date: '9/12/2025',
    description: 'An overview of the Princeton Quantitative Traders club, our mission, and our upcoming events.',
    materials: [
      {
        name: 'Presentation Slides',
        url: '/documents/pqt-info-session.pdf',
        type: 'slideshow'
      }
    ]
  }
];

export default function PastEvents() {
  const [activeEvent, setActiveEvent] = useState(events[0].id);

  const currentEvent = events.find(event => event.id === activeEvent);

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case 'slideshow':
        return '📊';
      case 'document':
        return '📄';
      case 'video':
        return '🎥';
      default:
        return '📁';
    }
  };

  return (
    <div className="bg-neutral-100 min-h-screen">
      {/* Header Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-neutral-90">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-neutral-05 mb-6">
            Past Events
          </h1>
          <p className="text-xl text-neutral-60 max-w-3xl mx-auto">
            Explore our previous workshops, seminars, and events. Access slideshows, 
            materials, and resources from past sessions.
          </p>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Event Tabs */}
            <div className="lg:col-span-1">
              <div className="bg-neutral-90 rounded-2xl p-6 sticky top-8">
                <h2 className="text-2xl font-bold text-neutral-05 mb-6">Events</h2>
                <div className="space-y-2">
                  {events.map((event) => (
                    <button
                      key={event.id}
                      onClick={() => setActiveEvent(event.id)}
                      className={`w-full text-left p-4 rounded-xl transition-colors duration-200 ${
                        activeEvent === event.id
                          ? 'bg-bright text-neutral-100'
                          : 'bg-neutral-85 text-neutral-10 hover:bg-neutral-80 hover:text-neutral-05'
                      }`}
                    >
                      <div className="font-semibold mb-1">{event.title}</div>
                      <div className="text-sm opacity-80">{event.date}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="lg:col-span-2">
              {currentEvent && (
                <div className="bg-neutral-90 rounded-2xl p-8">
                  <div className="mb-6">
                    <h3 className="text-3xl font-bold text-neutral-05 mb-2">
                      {currentEvent.title}
                    </h3>
                    <div className="text-bright font-semibold mb-4">
                      {currentEvent.date}
                    </div>
                    <p className="text-neutral-60 text-lg leading-relaxed">
                      {currentEvent.description}
                    </p>
                  </div>

                  {/* Materials Section */}
                  {currentEvent.materials && currentEvent.materials.length > 0 && (
                    <div>
                      <h4 className="text-xl font-semibold text-neutral-05 mb-4">
                        Event Materials
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {currentEvent.materials.map((material, index) => (
                          <Link
                            key={index}
                            href={material.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-neutral-85 hover:bg-neutral-80 rounded-xl p-4 transition-colors duration-200 group"
                          >
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">
                                {getMaterialIcon(material.type)}
                              </span>
                              <div>
                                <div className="font-semibold text-neutral-05 group-hover:text-bright transition-colors">
                                  {material.name}
                                </div>
                                <div className="text-sm text-neutral-60 capitalize">
                                  {material.type}
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No Materials Message */}
                  {(!currentEvent.materials || currentEvent.materials.length === 0) && (
                    <div className="text-center py-8">
                      <div className="text-6xl mb-4">📚</div>
                      <p className="text-neutral-60">
                        Materials for this event will be available soon.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-neutral-90">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-neutral-05 mb-6">
            Want to Stay Updated?
          </h2>
          <p className="text-neutral-60 text-lg mb-8">
            Join our club to get notified about upcoming events and access to exclusive materials.
          </p>
          <Link
            href="/join"
            className="bg-bright text-neutral-100 px-8 py-4 rounded-full text-lg font-semibold hover:bg-bright-light hover:text-neutral-100 transition-colors duration-200"
          >
            Join Our Club
          </Link>
        </div>
      </section>
    </div>
  );
}
