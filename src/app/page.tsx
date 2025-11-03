import Image from "next/image";
import Link from "next/link";
import { Linkedin, Instagram } from "lucide-react";

// Helper: social icon wrapper
const SocialIcon = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-500 hover:text-[#d26b2c] transition-colors duration-300"
  >
    {children}
  </a>
);

// Icon components
const LinkedinIcon = () => <Linkedin className="w-5 h-5" strokeWidth={2} />;
const InstagramIcon = () => <Instagram className="w-5 h-5" strokeWidth={2} />;

export default function Home() {
  const officers = [
    {
      name: "Charles Muehlberger",
      role: "President",
      description: "Sophomore, ECE major",
      img_src:
        "https://media.licdn.com/dms/image/v2/D5603AQEiL4nYie2M0w/profile-displayphoto-scale_400_400/B56ZosMDtcJQAg-/0/1761677951076?e=1762992000&v=beta&t=PVSCfriKs3Ao9lg2Y1ka0XrTscDyqlXjEYbEX5HqdDE",
      linkedin_url: "https://www.linkedin.com/in/charlesmuehl/",
      instagram_url: "https://www.instagram.com/charles.muehlberger/",
    },
    {
      name: "Loc Tran",
      role: "Vice President",
      description: "Sophomore, ORFE major",
      img_src:
        "https://media.licdn.com/dms/image/v2/D5603AQEZ14nZMIivVA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1727748824296?e=1763596800&v=beta&t=gWP4eyIWHrloguSh76qZRI6QnwD3YBDcXAGYWOWKACs",
      linkedin_url: "https://www.linkedin.com/in/loctran0323/",
      instagram_url: "https://www.instagram.com/loctran136/",
    },
    {
      name: "Rodrigo Porto",
      role: "Treasurer",
      description: "Junior, Math major",
      img_src:
        "https://media.licdn.com/dms/image/v2/D4E03AQGQKk4HvDzzQw/profile-displayphoto-shrink_400_400/B4EZNwWL7aH0A8-/0/1732756685091?e=1763596800&v=beta&t=F-UjpRISvT7sB365n_OrD3mIpfyu6YjD_BulH1eS7a0",
      linkedin_url: "https://www.linkedin.com/in/rodrigo-porto-760150169/",
      instagram_url: "https://www.instagram.com/rodrigo_sdp/",
    },
    {
      name: "Jerry Han",
      role: "President-Emeritus",
      description: "Junior, Math major",
      img_src:
        "https://media.licdn.com/dms/image/v2/D4E03AQGd-QPCGBDQaQ/profile-displayphoto-scale_400_400/B4EZnRQS1QIMAg-/0/1760152334915?e=1763596800&v=beta&t=_jACbD-dTwU4o0wNkTmwv-zeGVXh1NMcj5DXHeWC40w",
      linkedin_url: "https://www.linkedin.com/in/jerry-han/",
      instagram_url: "https://www.instagram.com/j.erry.han/",
    },
    {
      name: "Tom Wang",
      role: "Web Development Lead",
      description: "Sophomore, ECE major",
      img_src:
        "https://media.licdn.com/dms/image/v2/D4E03AQEAijlufTxPiw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1706971701106?e=1763596800&v=beta&t=eh3wSvKyQBI4oqdff4hELLzXmRrGpgu-yfzcok0Wk_U",
      linkedin_url: "https://www.linkedin.com/in/tom-wang-105a6722b/",
      instagram_url: "https://www.instagram.com/tom_wang_05/",
    },
    {
      name: "Joshua Lin",
      role: "Tournament Events Officer",
      description: "Junior, Math major",
      img_src:
        "https://media.licdn.com/dms/image/v2/D4E03AQF8iE4_LFn0ag/profile-displayphoto-shrink_400_400/B4EZYiuwgzHgAk-/0/1744339405331?e=1763596800&v=beta&t=1c4hVnKYd4VHrieoEC_kq0uMiy5InWw6Rsk1vk3kMFY",
      linkedin_url: "https://www.linkedin.com/in/lintropic-joshua/",
      instagram_url: "https://www.instagram.com/perplexed._.panda/",
    },
    {
      name: "Andrew Chen",
      role: "Tournament Director",
      description: "Grad Student, ChemE major",
      img_src:
        "https://media.licdn.com/dms/image/v2/D5603AQGUGLyXDiAQyA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1692736493041?e=1763596800&v=beta&t=4l3eYxt_4PISD2NEDr94Ua71ekD9QT8FxJntXveDJbA",
      linkedin_url: "https://www.linkedin.com/in/andrewchen0201/",
      instagram_url: "https://www.instagram.com/an6rew_chen/",
    },
    {
      name: "Jaime Nunez",
      role: "Outreach",
      description: "Sophomore, ORFE major",
      img_src:
        "https://media.licdn.com/dms/image/v2/D4E03AQEVhNB32GE6EA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1690314745956?e=1763596800&v=beta&t=rsnGJYe7TGTuYfbNpQIbQ3fxCKaTSbzbRTD04ZBjitU",
      linkedin_url: "https://www.linkedin.com/in/jaime-nunez8031/",
      instagram_url: "https://www.instagram.com/jaimen8031/",
    },
  ];

  return (
    <main className="min-h-screen bg-[#d2c3b3] text-[#2e2b28] font-sans antialiased">
      {/* Hero Section */}
      <section className="px-6 sm:px-10 lg:px-16 py-28 border-b border-[#e2dcd6] text-center">
        <div className="max-w-5xl mx-auto">
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

      {/* Officers Section */}
      <section className="py-24 px-6 sm:px-10 lg:px-16 bg-[#cbb6a6] border-b border-[#bda89a]/40">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-serif font-semibold mb-12">
            Meet Our Officers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
            {officers.map((officer, index) => (
              <div
                key={index}
                className="text-center group bg-white/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
              >
                <Image
                  src={officer.img_src}
                  alt={officer.name}
                  width={120}
                  height={120}
                  className="rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg font-serif font-semibold text-[#2e2b28] group-hover:text-[#b46b35] transition-colors">
                  {officer.name}
                </h3>
                <p className="text-[#b46b35] font-medium">{officer.role}</p>
                <p className="text-sm text-[#463f3a] leading-relaxed mt-2">
                  {officer.description}
                </p>
                <div className="flex justify-center gap-4 mt-3">
                  {officer.linkedin_url && (
                    <SocialIcon href={officer.linkedin_url}>
                      <LinkedinIcon />
                    </SocialIcon>
                  )}
                  {officer.instagram_url && (
                    <SocialIcon href={officer.instagram_url}>
                      <InstagramIcon />
                    </SocialIcon>
                  )}
                </div>
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
  
              <div className="flex justify-between">
                <dt>COSCONxPQT</dt>
                <dd className="font-medium text-[#d26b2c]">
                  November 16th
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
                <dt>Fall Trading Competition</dt>
                <dd className="font-medium text-[#d26b2c]">
                  November 22nd
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 sm:px-10 lg:px-16 py-24 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-serif font-semibold mb-4">Want to join?</h2>
          <p className="text-[#4c4742] text-lg mb-8 leading-relaxed">
            Interested in joining a community of like-minded peers, applying
            theory to practice through real-world projects, or competing in
            national trading competitions?
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