"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Linkedin, Instagram, MessageSquare } from "lucide-react";

// Social icon wrapper
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

const LinkedinIcon = () => <Linkedin className="w-6 h-6" strokeWidth={2} />;
const InstagramIcon = () => <Instagram className="w-6 h-6" strokeWidth={2} />;
const GroupMeIcon = () => <MessageSquare className="w-6 h-6" strokeWidth={2} />;

export default function OfficersSection({ officers }: { officers: any[] }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="py-24 px-6 sm:px-10 lg:px-16 bg-[#cbb6a6] border-b border-[#bda89a]/40"
    >
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-serif font-semibold mb-12">
          Meet Our Officers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
          {officers.map((officer, index) => (
            <div
              key={index}
              className="group w-full max-w-xs mx-auto [perspective:1000px]"
            >
              <div className="relative w-full h-96 transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                {/* Front */}
                <div className="absolute inset-0 bg-white/50 rounded-2xl shadow-sm hover:shadow-md [backface-visibility:hidden] flex flex-col items-center justify-center p-6">
                  <Image
                    src={officer.img_src}
                    alt={officer.name}
                    width={120}
                    height={120}
                    className="rounded-full mb-4 object-cover"
                    unoptimized
                  />
                  <h3 className="text-lg font-serif font-semibold text-[#2e2b28]">
                    {officer.name}
                  </h3>
                  <p className="text-[#b46b35] font-medium">{officer.role}</p>
                </div>
                {/* Back */}
                <div className="absolute inset-0 bg-white/50 rounded-2xl [transform:rotateY(180deg)] [backface-visibility:hidden] flex flex-col justify-between p-6">
                  <p className="text-sm text-[#463f3a] mb-6">
                    {officer.description}
                  </p>
                  <div className="flex justify-center items-center gap-6 mt-auto">
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
                    {officer.groupme_url && (
                      <SocialIcon href={officer.groupme_url}>
                        <GroupMeIcon />
                      </SocialIcon>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
