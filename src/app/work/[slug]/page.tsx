import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Effects } from "@/components/Effects";
import { ProjectVisual } from "@/components/ProjectVisual";
import { CaseNav } from "@/components/CaseNav";
import { projects, getProject } from "@/content/projects";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    openGraph: { title: project.title, description: project.summary },
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <article className="case">
      <Effects />
      <div className="read-progress" aria-hidden="true" />

      {/* The hero stays in the dark world of the home page, with the system running live beside it */}
      <header className="case-hero">
        <div className="wrap">
          <Link href="/#work" className="back">
            Back to all systems
          </Link>
          <div className="case-hero-grid">
            <div className="case-hero-copy">
              <p className="badge case-badge">{project.status}</p>
              <h1 className="case-title">{project.title}</h1>
              <p className="case-summary">{project.summary}</p>
              <p className="case-outcome">{project.outcome}</p>
            </div>
            <div className="case-visual glass" aria-hidden="true">
              <div className="case-visual-inner">
                <ProjectVisual slug={project.slug} />
              </div>
            </div>
          </div>

          <dl className="facts glass">
            <div>
              <dt>Where</dt>
              <dd>{project.context}</dd>
            </div>
            <div>
              <dt>My role</dt>
              <dd>{project.role}</dd>
            </div>
            <div>
              <dt>When</dt>
              <dd>{project.period}</dd>
            </div>
            <div className="facts-stack">
              <dt>Stack</dt>
              <dd>
                <ul className="chips">
                  {project.stack.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </header>

      {/* The story: each part on its own glass panel, with a section bar that follows you */}
      <div className="case-body">
        <CaseNav
          items={[
            { id: "problem", label: "Problem" },
            { id: "how", label: "How it works" },
            { id: "outcome", label: "Results" },
            { id: "next", label: "Next" },
          ]}
        />

        <section id="problem" className="section case-section" aria-labelledby="problem-title">
          <div className="wrap">
            <div className="case-panel glass split" data-reveal>
              <h2 id="problem-title" className="section-title">
                The problem
              </h2>
              <div className="prose">
                {project.problem.map((para) => (
                  <p key={para}>{para}</p>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="how" className="section case-section" aria-labelledby="how-title">
          <div className="wrap">
            <div className="case-panel glass split">
              <div>
                <h2 id="how-title" className="section-title">
                  How it works
                </h2>
                <p className="case-panel-note">
                  {project.pipeline.length} steps, from input to result. They light up as you scroll.
                </p>
              </div>
              <ol className="steps">
                {project.pipeline.map((step) => (
                  <li key={step.title}>
                    <h3 className="step-title">{step.title}</h3>
                    <p className="step-detail">{step.detail}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section id="outcome" className="section case-section" aria-label="What I built and the results">
          <div className="wrap duo">
            <div className="glass panel spot" data-reveal>
              <h2 className="panel-title">What I built</h2>
              <ul className="bullets">
                {project.built.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="glass panel panel-results spot" data-reveal>
              <h2 className="panel-title">Results</h2>
              <ul className="bullets checks">
                {project.results.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <nav id="next" className="section case-section" aria-label="Next project">
          <div className="wrap">
            <Link href={`/work/${next.slug}`} className="next glass spot" data-reveal>
              <span className="next-copy">
                <span className="next-label">Next system</span>
                <span className="next-title">{next.title}</span>
                <span className="next-summary">{next.summary}</span>
              </span>
              <span className="next-visual" aria-hidden="true">
                <ProjectVisual slug={next.slug} />
              </span>
            </Link>
          </div>
        </nav>
      </div>
    </article>
  );
}
