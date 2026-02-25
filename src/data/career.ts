import type { CareerEntry } from "../lib/types";
import type { Locale } from "../i18n/config";

const careerData: Record<Locale, CareerEntry[]> = {
  ja: [
    {
      id: "bengo4",
      company: "弁護士ドットコム株式会社",
      role: "Software Engineer",
      period: "2025年4月 - 現在",
      description: "",
      type: "work",
      tags: ["Go", "TypeScript"],
      current: true,
    },
    {
      id: "lovegraph",
      company: "株式会社ラブグラフ",
      role: "Software Engineer Intern",
      period: "2024年6月 - 2024年3月 (10ヶ月)",
      description: "",
      type: "internship",
      tags: ["Ruby", "JavaScript"],
    },
    {
      id: "bengo4-internship",
      company: "弁護士ドットコム株式会社",
      role: "Software Engineer Intern",
      period: "2024年9月 (1週間)",
      description: "",
      type: "internship",
      tags: ["Go", "TypeScript"],
    },
    {
      id: "gmo-papabo",
      company: "GMOペパボ株式会社",
      role: "Software Engineer Intern",
      period: "2024年7月 - 2024年8月 (2週間)",
      description: "",
      type: "internship",
      tags: ["JavaScript", "PHP"],
    },
    {
      id: "itd-gbs",
      company: "IT-Deutschland Global Business Solutions 株式会社",
      role: "Software Engineer Intern",
      period: "2024年6月 - 2024年7月 (1ヶ月)",
      description: "",
      type: "internship",
      tags: ["Python"],
    },
    {
      id: "tuj",
      university: "Temple University, Japan Campus",
      major: "B.S., Computer Science",
      period: "2023年5月 - 2025年5月",
      description: "",
      type: "education",
    },
    {
      id: "umm",
      university: "University of Minnesota, Morris",
      major: "B.A., Physics",
      period: "2021年1月 - 2022年7月",
      description: "",
      type: "education",
    },
  ],
  en: [
    {
      id: "bengo4",
      company: "Bengo4.com, Inc.",
      role: "Software Engineer",
      period: "Apr 2025 - Present",
      description: "",
      type: "work",
      tags: ["Go", "TypeScript"],
      current: true,
    },
    {
      id: "lovegraph",
      company: "Lovegraph, Inc.",
      role: "Software Engineer Intern",
      period: "Jun 2024 - Mar 2024 (10 months)",
      description: "",
      type: "internship",
      tags: ["Ruby", "JavaScript"],
    },
    {
      id: "bengo4-internship",
      company: "Bengo4.com, Inc.",
      role: "Software Engineer Intern",
      period: "Sep 2024 (1 week)",
      description: "",
      type: "internship",
      tags: ["Go", "TypeScript"],
    },
    {
      id: "gmo-papabo",
      company: "GMO Pepabo, Inc.",
      role: "Software Engineer Intern",
      period: "Jul 2024 - Aug 2024 (2 weeks)",
      description: "",
      type: "internship",
      tags: ["JavaScript", "PHP"],
    },
    {
      id: "itd-gbs",
      company: "IT-Deutschland Global Business Solutions",
      role: "Software Engineer Intern",
      period: "Jun 2024 - Jul 2024 (1 month)",
      description: "",
      type: "internship",
      tags: ["Python"],
    },
    {
      id: "tuj",
      university: "Temple University, Japan Campus",
      major: "B.S., Computer Science",
      period: "May 2023 - May 2025",
      description: "",
      type: "education",
    },
    {
      id: "umm",
      university: "University of Minnesota, Morris",
      major: "B.A., Physics",
      period: "Jan 2021 - Jul 2022",
      description: "",
      type: "education",
    },
  ],
};

export function getCareer(locale: Locale): CareerEntry[] {
  return careerData[locale];
}

// Keep backward-compatible export for any other references
export const career = careerData.ja;
