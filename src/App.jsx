// src/App.jsx
import MedicalBackground from "./components/MedicalBackground";
import Header from "./components/Header";
import Section from "./components/Section";
import resume from "./data/resume";
import BackToTop from "./components/BackToTop";
import QRCodeDisplay from "./QRCodeDisplay";

export default function App() {
  return (
    <div className="min-h-screen relative">
      <MedicalBackground />

      <BackToTop threshold={600} />
      <Header />
      <main className="space-y-8 pb-16">
        <Section id="profile" title="Profile">
          <p>{resume.profile}</p>
        </Section>

        <Section id="skills" title="Skills">
          <ul>
            {resume.skills.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </Section>

        <Section id="courses" title="Courses">
          <p>{resume.courses.join(" • ")}</p>
        </Section>

        <Section id="experience" title="Experience">
          {resume.experience.map((job) => (
            <div key={job.title} className="mb-6">
              <h3 className="font-semibold">{job.title}</h3>
              <div className="text-sm text-slate-300/80">
                {job.org} • {job.period}
              </div>
              <ul className="mt-2">
                {job.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </Section>

        <Section id="education" title="Education">
          <ul>
            {resume.education.map((ed) => (
              <li key={ed.degree}>
                <span className="font-medium">{ed.degree}</span> — {ed.school} (
                {ed.year})
              </li>
            ))}
          </ul>
        </Section>

        <Section id="achievements" title="Achievements">
          <ul>
            {resume.achievements.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </Section>

        <Section id="languages" title="Languages">
          <ul>
            {resume.languages.map((l) => (
              <li key={l.name}>
                {l.name} — {l.level}
              </li>
            ))}
          </ul>
        </Section>

        <Section id="references" title="References">
          <ul>
            {resume.references.map((r) => (
              <li key={r.name}>
                <span className="font-medium">{r.name}</span> — {r.role} (
                {r.contact})
              </li>
            ))}
          </ul>
        </Section>
        {/* <Section id="qr-code" title="Scan My Resume">
          <div className="flex justify-center items-center">
            <QRCodeDisplay />
          </div>
        </Section> */}
      </main>
    </div>
  );
}
