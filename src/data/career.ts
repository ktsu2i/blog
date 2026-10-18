import type { CareerEntry } from "../lib/types";
import type { Locale, Localized } from "../i18n/config";

type WorkEntry = Extract<CareerEntry, { type: "work" | "internship" }>;
type EducationEntry = Extract<CareerEntry, { type: "education" }>;

const career: (
  | Localized<WorkEntry, "company" | "period" | "description">
  | Localized<EducationEntry, "period" | "description">
)[] = [
  {
    id: "bengo4",
    role: "Software Engineer",
    type: "work",
    tags: ["Go", "TypeScript"],
    current: true,
    localized: {
      ja: {
        company: "弁護士ドットコム株式会社",
        period: "2025年4月 - 現在",
        description: "",
      },
      en: {
        company: "Bengo4.com, Inc.",
        period: "Apr 2025 - Present",
        description: "",
      },
    },
  },
  {
    id: "lovegraph",
    role: "Software Engineer Intern",
    type: "internship",
    tags: ["Ruby", "JavaScript"],
    localized: {
      ja: {
        company: "株式会社ラブグラフ",
        period: "2024年6月 - 2025年3月 (10ヶ月)",
        description: "",
      },
      en: {
        company: "Lovegraph, Inc.",
        period: "Jun 2024 - Mar 2025 (10 months)",
        description: "",
      },
    },
  },
  {
    id: "bengo4-internship",
    role: "Software Engineer Intern",
    type: "internship",
    tags: ["Go", "TypeScript"],
    localized: {
      ja: {
        company: "弁護士ドットコム株式会社",
        period: "2024年9月 (1週間)",
        description: "",
      },
      en: {
        company: "Bengo4.com, Inc.",
        period: "Sep 2024 (1 week)",
        description: "",
      },
    },
  },
  {
    id: "gmo-papabo",
    role: "Software Engineer Intern",
    type: "internship",
    tags: ["JavaScript", "PHP"],
    localized: {
      ja: {
        company: "GMOペパボ株式会社",
        period: "2024年7月 - 2024年8月 (2週間)",
        description: "",
      },
      en: {
        company: "GMO Pepabo, Inc.",
        period: "Jul 2024 - Aug 2024 (2 weeks)",
        description: "",
      },
    },
  },
  {
    id: "itd-gbs",
    role: "Software Engineer Intern",
    type: "internship",
    tags: ["Python"],
    localized: {
      ja: {
        company: "IT-Deutschland Global Business Solutions 株式会社",
        period: "2024年6月 - 2024年7月 (1ヶ月)",
        description: "",
      },
      en: {
        company: "IT-Deutschland Global Business Solutions, K.K.",
        period: "Jun 2024 - Jul 2024 (1 month)",
        description: "",
      },
    },
  },
  {
    id: "tuj",
    university: "Temple University, Japan Campus",
    major: "B.S., Computer Science",
    type: "education",
    localized: {
      ja: { period: "2023年5月 - 2025年5月", description: "" },
      en: { period: "May 2023 - May 2025", description: "" },
    },
  },
  {
    id: "umm",
    university: "University of Minnesota, Morris",
    major: "B.A., Physics",
    type: "education",
    localized: {
      ja: { period: "2021年1月 - 2022年7月", description: "" },
      en: { period: "Jan 2021 - Jul 2022", description: "" },
    },
  },
];

export function getCareer(locale: Locale): CareerEntry[] {
  // Destructuring the union loses the type/field correlation
  return career.map(
    ({ localized, ...entry }) =>
      ({ ...entry, ...localized[locale] }) as CareerEntry,
  );
}
