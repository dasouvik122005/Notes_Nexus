/**
 * Site-wide configuration and brand constants.
 * Modify this file to rename the platform, update university references, or adjust theme tokens.
 */
export const siteConfig = {
  name: "Notes Nexus",
  shortName: "NotesNexus",
  tagline: "Your Campus Resource & Study Hub",
  description:
    "Free comprehensive study materials, notes, and previous year questions (PYQs) across all university departments.",
  university: "JIS University",
  disclaimer: "A student initiative. Not affiliated with or endorsed by JIS University or any educational institution.",
  shortDisclaimer: "Unofficial Student Initiative",
  url: "https://notes-nexus-jisu.vercel.app",
  links: {
    feedback: "https://forms.gle/WfbtFjHj3pS9RyQg9",
    github: "https://github.com/dasouvik122005/Notes_Nexus",
  },
  theme: {
    primaryYellow: "#FDE047",
    primaryPink: "#F472B6",
    primaryBlue: "#60A5FA",
    primaryGreen: "#4ADE80",
    accentBlue: "#6BA6F7",
    bgColor: "#FDFBF7",
    black: "#000000",
    white: "#FFFFFF",
  },
  nav: [
    { label: "HOME", href: "/" },
    { label: "NOTES", href: "/notes" },
    { label: "PYQ", href: "/pyq" },
    { label: "INSTRUMENTS", href: "/instruments" },
    { label: "ABOUT", href: "/about" },
  ],
};

export type SiteConfig = typeof siteConfig;
