export type Program = {
  number: string;
  title: string;
  description: string;
};

export type Officer = {
  name: string;
  role: string;
  detail: string;
  photo?: string;
  interest?: string;
  linkedin?: string;
};

export type EventMaterial = {
  label: string;
  href: string;
};

export type ClubEvent = {
  title: string;
  date: string;
  description: string;
  materials: EventMaterial[];
};

export type Sponsor = {
  name: string;
  logo: string;
};

export const clubLinks = {
  email: "mailto:pqt@princeton.edu",
  emailLabel: "pqt@princeton.edu",
  instagram: "https://www.instagram.com/princetonquanttraders/",
  groupMe: "https://groupme.com/join_group/111159295/jL93cFqW",
  resumeDrop: "https://docs.google.com/forms/d/e/1FAIpQLSedo1q-9jpVy9vmNfgHkwhd5PxIcfWzH5PwR9M80UDY_WJ6CQ/viewform",
  sponsorshipPackage: "/documents/pqt-sponsorship26.pdf",
} as const;

export const programs: Program[] = [
  {
    number: "01",
    title: "Research & projects",
    description:
      "Study market structure, machine learning, and data through practical, member-led work.",
  },
  {
    number: "02",
    title: "Interview preparation",
    description:
      "Practice the probability, reasoning, and technical questions used in quantitative trading interviews.",
  },
  {
    number: "03",
    title: "Trading competitions",
    description:
      "Apply theory in market simulations and intercollegiate trading competitions.",
  },
];

export const officers: Officer[] = [
  {
    name: "Grace Im",
    role: "President",
    detail: "Class of 2029",
    photo: "/images/officers/grace.webp",
    interest: "Direction, sponsor relationships, and the fall competition.",
    linkedin: "https://www.linkedin.com/in/grace-im-293095241/",
  },
  {
    name: "Abhi Bansal",
    role: "Vice President",
    detail: "Class of 2027",
    photo: "/images/officers/abhi.jpeg",
    interest: "Programming, partnerships, and keeping the semester on the rails.",
    linkedin: "https://www.linkedin.com/in/abhi-bansal-2000b3296/",
  },
  {
    name: "Evan Xie",
    role: "Head of Education",
    detail: "Class of 2028",
    interest: "Weekly curriculum: probability, market making, and Python.",
    linkedin: "https://www.linkedin.com/in/evan-xie-ex57/",
  },
  {
    name: "Brooke Xu",
    role: "Head of Education",
    detail: "Class of 2028",
    photo: "/images/officers/brooke.webp",
    interest: "Weekly curriculum: probability, market making, and Python.",
    linkedin: "https://www.linkedin.com/in/brooke-xu/",
  },
  {
    name: "Tom Wang",
    role: "Head of Competitions & Tech Lead",
    detail: "Class of 2028",
    photo: "/images/officers/tom.webp",
    interest: "The fall trading competition and our in-house simulated markets.",
    linkedin: "https://www.linkedin.com/in/tom-wang-105a6722b/",
  },
  {
    name: "Joshua Lin",
    role: "Head of Competitions & Tech Lead",
    detail: "Class of 2027",
    interest: "The fall trading competition and our in-house simulated markets.",
    linkedin: "https://www.linkedin.com/in/lin-joshua/",
  },
  {
    name: "Ty Lipscomb",
    role: "Corporate Relations",
    detail: "Class of 2028",
    interest: "Sponsors, firm treks, and speaker events.",
    linkedin: "https://www.linkedin.com/in/tylipscomb/",
  },
  {
    name: "Brandon Wilk",
    role: "Treasurer",
    detail: "Class of 2028",
    photo: "/images/officers/brandon.webp",
    interest: "Budget, travel logistics, and trek applications.",
    linkedin: "https://www.linkedin.com/in/brandwilk/",
  },
  {
    name: "Graham Smith",
    role: "Internal Development",
    detail: "Class of 2028",
    interest: "Member development and recruitment preparation.",
    linkedin: "https://www.linkedin.com/in/graham-smith1/",
  },
  {
    name: "Daniel Amoils",
    role: "Internal Development",
    detail: "Class of 2029",
    photo: "/images/officers/daniel.webp",
    interest: "Member development and recruitment preparation.",
    linkedin: "https://www.linkedin.com/in/daniel-amoils-851047316/",
  },
  {
    name: "Deeta Saravanan",
    role: "Operations & Recruitment",
    detail: "Class of 2029",
    photo: "/images/officers/deeta.webp",
    interest: "Interviews and applications.",
    linkedin: "https://www.linkedin.com/in/deeta-saravanan/",
  },
];

export const events: ClubEvent[] = [
  {
    title: "PQT Fall 2026 Info Session",
    date: "September 10, 2026",
    description:
      "An introduction to Princeton Quantitative Traders and the 2026–2027 application process, held in Lewis Center 138.",
    materials: [
      {
        label: "Presentation slides",
        href: "https://docs.google.com/presentation/d/165YcKL3ncGRNbvKiccc9S9HWKNLClWtk/edit?usp=sharing&ouid=112795248828502944495&rtpof=true&sd=true",
      },
    ],
  },
  {
    title: "PQT Fall Trading Competition 2025",
    date: "November 22, 2025",
    description:
      "PQT's first trading competition. Students participated in eight rounds of a trading game using a price distribution, live market updates, and forced trades based on their positions.",
    materials: [
      {
        label: "Opening slides",
        href: "https://docs.google.com/presentation/d/1RwFBHAHHFX3gDR4hwMGh7NcxoejEfTR1nqP94tbmF18/edit?usp=sharing",
      },
      {
        label: "Rounds 1–8",
        href: "https://drive.google.com/drive/folders/17p3TQaNijcdxqyxTr2MtW6nBulJAXyUT?usp=sharing",
      },
    ],
  },
  {
    title: "COSCON × PQT Trading Game 2025",
    date: "November 16, 2025",
    description:
      "A trading game hosted by COSCON and PQT where students bet on a bracket of teams using distributions of team attributes.",
    materials: [],
  },
  {
    title: "Mock Interview Prep Sheets",
    date: "November 6, 2025",
    description: "Mock interview preparation for quantitative trading roles.",
    materials: [
      {
        label: "Interview prep folder",
        href: "https://drive.google.com/drive/folders/1_ifBkErkxHFHMaHBC4jUSghe4U5IOAIa?usp=drive_link",
      },
    ],
  },
  {
    title: "PQT Project Series",
    date: "October 22, 2025",
    description:
      "A showcase of ongoing projects, from algorithmic research to data-driven experiments, with an open repository for contributions.",
    materials: [
      {
        label: "Project repository",
        href: "https://github.com/charlespers/PQT_Education_Series_25-26",
      },
    ],
  },
  {
    title: "PQT Education Series: Probabilities",
    date: "September 25, 2025",
    description:
      "An introduction to probability theory used in quantitative finance, connecting mathematical ideas with practical intuition.",
    materials: [
      {
        label: "Beginner slides",
        href: "/documents/pqt_ed_series_beginner.pdf",
      },
      {
        label: "Advanced slides",
        href: "/documents/pqt_ed_series_advanced.pdf",
      },
    ],
  },
  {
    title: "Princeton Quantitative Traders Info Session",
    date: "September 12, 2025",
    description:
      "An overview of the club, its mission, and its initiatives for the semester.",
    materials: [
      {
        label: "Presentation slides",
        href: "/documents/pqt-info-session.pdf",
      },
    ],
  },
];

export const goldSponsors: Sponsor[] = [
  { name: "Citadel", logo: "/images/citadel-logo.jpg" },
  { name: "Jane Street", logo: "/images/jane-street-logo.png" },
  { name: "Hudson River Trading", logo: "/images/hrt-logo.svg" },
  { name: "Five Rings", logo: "/images/five-rings-logo.jpeg" },
  { name: "D.E. Shaw", logo: "/images/DEShaw-logo.jpg" },
  { name: "Jump Trading", logo: "/images/jump-trading-logo.webp" },
  { name: "Susquehanna", logo: "/images/susquehanna-logo.svg" },
];

export const silverSponsors: Sponsor[] = [
  { name: "Seven Research", logo: "/images/seven-research-logo.svg" },
  { name: "Tower Research", logo: "/images/tower-logo.svg" },
  { name: "Walleye Capital", logo: "/images/walleye-capital-logo.svg" },
];
