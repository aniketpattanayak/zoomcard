import { artistCategories } from "@shared/schema";

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
    title: "Industry Events Access",
    description: "Exclusive access to premieres, award shows, and industry gatherings",
    icon: "🎭"
  },
  {
    title: "Networking Opportunities",
    description: "Connect with top professionals and decision makers",
    icon: "🤝"
  },
  {
    title: "Priority Projects",
    description: "Get early access to upcoming projects and casting calls",
    icon: "⭐"
  },
  {
    title: "Professional Profile",
    description: "Verified industry presence and digital portfolio",
    icon: "👤"
  }
];

export const BLOOD_GROUPS = [
  "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"
] as const;
