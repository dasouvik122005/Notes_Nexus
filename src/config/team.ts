/**
 * Team roster configuration.
 * Order: 1. Kumaresh Jana, 2. Souvik Das, 3. Rajdip Garai.
 */
export interface TeamMember {
  name: string;
  initials: string;
  photo?: string;
  accent?: "white" | "blue";
  socials: {
    linkedin?: string;
    github?: string;
    instagram?: string[];
  };
}

export const teamMembers: TeamMember[] = [
  {
    name: "Kumaresh Jana",
    initials: "KJ",
    socials: {
      linkedin: "https://www.linkedin.com/in/kumaresh-jana-050406k",
      github: "https://github.com/iamkumaresh",
      instagram: [
        "https://instagram.com/__kumares_h",
        "https://instagram.com/_kumares_h",
      ],
    },
  },
  {
    name: "Souvik Das",
    initials: "SD",
    socials: {
      linkedin: "https://www.linkedin.com/in/souvikdas12102005/",
      github: "https://github.com/dasouvik122005",
      instagram: ["https://instagram.com/das_ouvik"],
    },
  },
  {
    name: "Rajdip Garai",
    initials: "RG",
    socials: {
      linkedin: "https://www.linkedin.com/in/rajdip-garai",
      github: "https://github.com/rajdipgarai",
      instagram: ["https://instagram.com/rajdipgarai_"],
    },
  },
];
