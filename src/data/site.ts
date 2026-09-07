export type Program = {
  number: string;
  title: string;
  description: string;
};

export type Officer = {
  name: string;
  role: string;
  detail: string;
  interest?: string;
  linkedin?: string;
  instagram?: string;
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
    detail: "Sophomore · Philosophy",
    interest: "AI, stochastic modeling, and reliable autonomy research",
  },
  {
    name: "Ahbi Bansal",
    role: "Vice President",
    detail: "Senior · Economics",
    interest: "The intersection of finance and technology",
  },
  {
    name: "Brandon Wilk",
    role: "Treasurer",
    detail: "Junior · MAE",
  },
  {
    name: "Jerry Han",
    role: "President-Emeritus",
    detail: "Junior · Mathematics",
    interest: "Trading and state-space model research",
    linkedin: "https://www.linkedin.com/in/jerry-han/",
    instagram: "https://www.instagram.com/j.erry.han/",
  },
  {
    name: "Tom Wang",
    role: "Tech Lead",
    detail: "Sophomore · ECE",
    interest: "Generalist robots, machine learning, and embedded systems",
    linkedin: "https://www.linkedin.com/in/tom-wang-105a6722b/",
    instagram: "https://www.instagram.com/tom_wang_05/",
  },
  {
    name: "Joshua Lin",
    role: "Tournament Events Officer",
    detail: "Junior · Mathematics",
    interest: "Optimization, probability, and analysis",
    linkedin: "https://www.linkedin.com/in/lintropic-joshua/",
    instagram: "https://www.instagram.com/perplexed._.panda/",
  },
  {
    name: "Andrew Chen",
    role: "Tournament Director",
    detail: "Graduate student · Chemical Engineering",
    linkedin: "https://www.linkedin.com/in/andrewchen0201/",
    instagram: "https://www.instagram.com/an6rew_chen/",
  },
];

export const events: ClubEvent[] = [
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
];

export const silverSponsors: Sponsor[] = [
  { name: "Tower Research", logo: "/images/tower-logo.svg" },
];
