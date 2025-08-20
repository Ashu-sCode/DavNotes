// src/data/programData.js
import {
  Code, Briefcase, DollarSign, BookOpen, GraduationCap,
  FlaskRound, Dna, Scroll, Microscope, Award
} from "lucide-react";

export const programData = {
  BCA: {
    icon: Code,
    image: "/images/bca.jpg",
    color: "from-blue-600 to-indigo-600",
  },
  BBA: {
    icon: Briefcase,
    image: "/images/bba.jpg",
    color: "from-orange-500 to-yellow-500",
  },
  BCom: {
    icon: DollarSign,
    image: "/images/bcom.jpg",
    color: "from-green-500 to-emerald-500",
  },
  BA: {
    icon: BookOpen,
    image: "/images/ba.jpg",
    color: "from-pink-500 to-rose-500",
  },
  "BA BEd": {
    icon: GraduationCap,
    image: "/images/babed.jpg",
    color: "from-violet-500 to-purple-500",
  },
  BSc: {
    icon: FlaskRound,
    image: "/images/bsc.jpg",
    color: "from-teal-500 to-cyan-500",
  },
  "BSc (Biotech)": {
    icon: Dna,
    image: "/images/biotech.jpg",
    color: "from-emerald-500 to-green-600",
  },
  MA: {
    icon: Scroll,
    image: "/images/ma.jpg",
    color: "from-red-500 to-pink-600",
  },
  MSc: {
    icon: Microscope,
    image: "/images/msc.jpg",
    color: "from-cyan-500 to-blue-600",
  },
  Diploma: {
    icon: Award,
    image: "/images/diploma.jpg",
    color: "from-yellow-500 to-orange-600",
  },
};
