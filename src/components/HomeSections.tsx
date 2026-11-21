import { AskMyAI } from "@/components/AskMyAI";
import { Orchestrator } from "@/components/Orchestrator";
import { Magnetic } from "@/components/Magnetic";
import { ContactIcons } from "@/components/ContactIcons";
import { SkillField } from "@/components/SkillField";
import { experience, education, certifications } from "@/content/profile";
import { site } from "@/content/site";

export function EngineSection() {
  return (
    <section id="engine" className="section" aria-labelledby="engine-title">
      <div className="wrap">
        <div className="section-intro" data-reveal>
          <h2 id="engine-title" className="section-title">
            How my systems work
          </h2>
          <p className="section-lede">
            Everything I build runs the same loop: perceive the input, reason about it, act on it. Pick a project to
            follow its path through the engine.
          </p>
        </div>
        <div data-reveal>
          <Orchestrator />
        </div>
      </div>
    </section>
  );
}

export function ExperienceSection() {
  return (
    <section id="experience" className="section" aria-labelledby="experience-title">
      <div className="wrap split">
        <div data-reveal>
          <h2 id="experience-title" className="section-title">
            Intern to AI engineer in five months
          </h2>
          <p className="section-lede">
            {experience.company}, {experience.location}. I build the healthcare AI that IMC Hospital runs every day.
          </p>
        </div>

        <ol className="timeline pane-glass" data-reveal>
          {experience.roles.map((role, i) => (
            <li key={role.title} className={i === 0 ? "is-current" : undefined}>
              <div className="role-head">
                <h3 className="role-title">{role.title}</h3>
                <span className="role-period">{role.period}</span>
              </div>
              <ul className="points">
                {role.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function SkillsSection() {
  return (
    <section id="skills" className="section" aria-labelledby="skills-title">
      <div className="wrap">
        <div className="section-intro" data-reveal>
          <h2 id="skills-title" className="section-title">
            The stack, in motion
          </h2>
          <p className="section-lede">Hover over any tool. Every one of them is used in the systems above.</p>
        </div>
        <div data-reveal>
          <SkillField />
        </div>
        <div className="credentials" data-reveal>
          {education.map((e) => (
            <div key={e.degree} className="pane-glass credential">
              <h3 className="credential-title">{e.degree}</h3>
              <p>{e.school}</p>
              <p className="muted">{e.period}</p>
            </div>
          ))}
          {certifications.map((c) => (
            <div key={c.name} className="pane-glass credential">
              <h3 className="credential-title">{c.name}</h3>
              <p>{c.issuer}</p>
              <p className="muted">{c.date}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AskSection() {
  return (
    <section id="ask" className="section" aria-labelledby="ask-title">
      <div className="wrap split">
        <div data-reveal>
          <h2 id="ask-title" className="section-title">
            Ask my AI
          </h2>
          <p className="section-lede">
            Short on time? Ask about my work and get a straight answer. It answers from the facts on this page, and
            nothing you type leaves your browser.
          </p>
        </div>
        <div data-reveal>
          <AskMyAI />
        </div>
      </div>
    </section>
  );
}

const HIRE_MESSAGE = "Hi Hussain, I saw your portfolio and would like to talk about";

export function ContactSection() {
  const hireLink = site.whatsapp
    ? `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(HIRE_MESSAGE)}`
    : `mailto:${site.email}`;

  return (
    <section id="contact" className="section section-contact" aria-labelledby="contact-title">
      <div className="wrap contact" data-reveal>
        <h2 id="contact-title" className="contact-title">
          Let&apos;s build AI that works in the real world.
        </h2>
        <p className="section-lede">
          Hiring an AI engineer, or planning a system that should hear, read or reason? Tell me about it. I&apos;d
          love to help build it.
        </p>
        <div className="contact-actions">
          <Magnetic href={hireLink} className="btn btn-solid btn-xl" external strength={0.4}>
            Hire me
          </Magnetic>
          {site.cv ? (
            <Magnetic href={site.cv} className="btn btn-glass btn-xl" download>
              Download CV
            </Magnetic>
          ) : null}
        </div>
        <ContactIcons size="lg" />
        <p className="signoff">Thanks for scrolling this far. The best systems start with a conversation.</p>
      </div>
    </section>
  );
}
