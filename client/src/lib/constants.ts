import { artistCategories } from "server/shared/schema";

export const CATEGORY_ICONS = {
  Artist: "🎨",
  Director: "🎬",
  Producer: "💼",
  Writer: "✍️",
  Production: "🎥",
  Cinematographer: "📷",
  Singer: "🎤",
  "Music Director": "🎵",
};

export const BENEFITS = [
  {
    title: "Pan India Shoots Access",
    description: "From artists to the entire crew, everyone can work on all shoots across Pan India seamlessly.",
    icon: "🎭"
  },
  {
    title: "Crew Member",
    description: "All crew members receive genuine, decent, and clean work opportunities through the trusted Zoom Card Association across Pan India shoots.",
    icon: "🤝"
  },
  {
    title: "Priority Projects",
    description: "Gain early access to upcoming projects, casting calls, and exclusive work opportunities through the trusted Zoom Card Association across Pan India.",
    icon: "⭐"
  },
  {
    title: "Professional Profile",
    description: "Verified industry presence and digital portfolio. Only genuine, verified professionals connect with Zoom Card members for trusted work opportunities across India.",
    icon: "👤"
  }
];

export const BLOOD_GROUPS = [
  "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"
] as const;
