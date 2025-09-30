// src/data/resume.js

/**
 * ============================
 * Resume Data (Single Source)
 * ============================
 * Edit this file to update your site content.
 *
 * Conventions:
 * - Keep strings simple; use plain text (no HTML).
 * - For external links (email/phone/maps), keep both "display" and "raw" formats where needed.
 * - For PDF download:
 *    • Option A (simple): put your file in /public/resume.pdf and set contact.pdf = "/resume.pdf"
 *    • Option B (auto filename): place a single PDF in /src/assets/resume and use the import.meta.glob trick in Header.jsx
 *
 * Sections below are grouped and documented so you can quickly find & edit content.
 */

/** ---------------------------------------------
 * CONTACT / HEADER
 * Used by Header.jsx and can be used in footer.
 * ----------------------------------------------
 */
const contact = {
  /** Your display name (shown in header) */
  name: "Dr. Anre Anvari",

  /** Short professional title/line under name (optional) */
  title: "General Surgery • Emergency Medicine • ICU & Trauma",

  /** Public email address (used in mailto:) */
  email: "anreanvari1@gmail.com",

  /**
   * Phone in raw international format for tel: link (no spaces/hyphens)
   * Example: +27627330527
   */
  phoneIntl: "+27627330527",

  /** Phone as you want it displayed to users */
  phonePretty: "+27 62 733 0527",

  /** Your location (used for Google Maps link) */
  location: "South Africa",

  /**
   * Social links (optional). Add/remove as needed.
   * Consumers can show icons if present.
   */
  social: {
    linkedin: undefined, // e.g. "https://www.linkedin.com/in/your-handle"
    github: undefined,
    website: undefined,
  },
};

/** ---------------------------------------------
 * PROFILE / SUMMARY
 * A concise paragraph about who you are & focus.
 * ----------------------------------------------
 */
const profile =
  "Qualified medical practitioner passionate about medicine and a healthy lifestyle. Keen interest in General Surgery, Emergency Medicine, ICU & Trauma. Experienced in minor surgical procedures (suturing, lipoma excision, keloid injections, abscess drainage), prescriptions, and patient notes.";

/** ---------------------------------------------
 * SKILLS
 * High-level skills & competencies.
 * ----------------------------------------------
 */
const skills = [
  "Advanced Cardio Life Support (ACLS)",
  "Advanced Trauma Life Support (ATLS)",
  "Basic & Essential Surgical Skills (BESST)",
  "Ultrasound Guided Vascular Access (USGVA)",
  "Computer literacy: MS Word, Excel, PowerPoint, Meditech, Email",
  "Communication, Empathy, Detail-oriented, Problem solving",
  "Teamwork & Work ethic",
  "Driver’s License",
];

/** ---------------------------------------------
 * COURSES / CERTIFICATIONS
 * Short list of badges or key courses.
 * ----------------------------------------------
 */
const courses = ["BLS", "ACLS", "ATLS", "BESST", "USGVA"];

/** ---------------------------------------------
 * EXPERIENCE
 * Each item = one role. Keep bullets action-oriented.
 * ----------------------------------------------
 */
const experience = [
  {
    title: "Medical Doctor — Community Service",
    org: "Schweizer Reneke Hospital",
    period: "2025 – Present",
    bullets: [
      "Performed minor surgical procedures: lipoma excision, circumcisions, Tru-Cut biopsy, keloid injections, abscess drainage.",
      "General medical officer duties including Cesarean Section, regional anesthesia (spinal), reductions & POP.",
      "OPD and clinic outreach; chronic care; ward rounds and in-patient management.",
    ],
  },
  {
    title: "Medical Doctor — Intern",
    org: "Pelonomi, Universitas & 3-Military Hospitals",
    period: "2023 – 2024",
    bullets: [
      "General Surgery: ward rounds; OR assisting/performing (under Dr. van den Heever).",
      "Plastic Surgery: assisted/performed skin grafts, breast reductions, flap closures — Dr. Nikita Blake.",
      "Internal Medicine: charts, prescriptions, patient management — Dr. FJ Bester.",
      "Weekend call cover (Plastic Surgery): rounds, theatre, referrals (with consultant cover) — Dr. Philip Coetzer.",
    ],
  },
  {
    title: "Secretary — Rock Climbing Club",
    org: "University of the Free State",
    period: "2018 – 2020",
    bullets: [
      "Supervised refurbishment of the climbing cave; coordinated with suppliers/contractors.",
      "Handled budget & petty cash; managed membership fees.",
      "Organized group outings for 10–20 participants.",
    ],
  },
];

/** ---------------------------------------------
 * EDUCATION
 * Reverse chronological is typical.
 * ----------------------------------------------
 */
const education = [
  {
    degree: "Fellowship of the Colleges of Surgeons: Primary",
    school: "Colleges of Medicine of South Africa",
    year: "2025",
  },
  {
    degree: "Bachelor of Medicine and Surgery (MBChB)",
    school: "University of the Free State (UFS)",
    year: "2022",
  },
  {
    degree: "Secondary School",
    school: "Grey High School (GHS)",
    year: "2013 – 2017",
  },
];

/** ---------------------------------------------
 * ACHIEVEMENTS
 * Awards, milestones, distinctions.
 * ----------------------------------------------
 */
const achievements = [
  "FCS Primary",
  "Top 50 in SA — National Mathematics Olympiad",
  "Science & English Olympiad Finalist",
  "Student Council & Officer in Cadet Detachment",
  "1st Team Chess, Tennis & Basketball at GHS",
  "2nd Team Tennis at UFS",
  "Captain — Eastern Cape Mathematics Team",
];

/** ---------------------------------------------
 * LANGUAGES
 * List each language with proficiency level.
 * ----------------------------------------------
 */
const languages = [
  { name: "English", level: "Fluent" },
  { name: "Afrikaans", level: "Professional" },
  { name: "Persian", level: "Professional" },
  { name: "Sesotho", level: "Basic" },
];

/** ---------------------------------------------
 * REFERENCES
 * For privacy, keep contacts "On request" if needed.
 * ----------------------------------------------
 */
const references = [
  {
    name: "Prof Jan du Plessis",
    role: "Head of Pediatric Oncology — Universitas Hospital, Bloemfontein",
    contact: "On request",
  },
  {
    name: "Dr Conwill van den Heever",
    role: "Registrar in General Surgery — Pelonomi & Universitas Hospital, Bloemfontein",
    contact: "On request",
  },
  {
    name: "Dr Frederick Bester",
    role: "Specialist in Internal Medicine — Life Rosepark Hospital, Bloemfontein",
    contact: "On request",
  },
  {
    name: "Dr Nikita Blake",
    role: "Specialist in Plastic Surgery — Universitas Hospital & Mediclinic, Bloemfontein",
    contact: "On request",
  },
];

/** ---------------------------------------------
 * OPTIONAL: NAVIGATION ORDER / SECTION LABELS
 * Use this if you want to generate a menu, or
 * control the order of sections in App.jsx.
 * ----------------------------------------------
 */
const sectionsOrder = [
  { id: "profile", label: "Profile" },
  { id: "skills", label: "Skills" },
  { id: "courses", label: "Courses" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "achievements", label: "Achievements" },
  { id: "languages", label: "Languages" },
  { id: "references", label: "References" },
];

/**
 * Export a single object so components can read everything from one place.
 * Example usage:
 *    import resume from "../data/resume";
 *    resume.contact.name
 *    resume.skills.map(...)
 */
const resume = {
  contact,
  profile,
  skills,
  courses,
  experience,
  education,
  achievements,
  languages,
  references,
  sectionsOrder, // optional helper
};

export default resume;
