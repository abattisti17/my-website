import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProjectById, projects } from '../data/projects';
import SiteFrame from '../components/SiteFrame';

const ProjectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const project = id ? getProjectById(id) : undefined;

  if (!project) {
    return (
      <SiteFrame>
        <section className="ab-page-head">
          <div className="ab-wrap">
            <h1>Project not found</h1>
            <p><Link to="/work">See all work</Link></p>
          </div>
        </section>
      </SiteFrame>
    );
  }

  const facts: [string, string | undefined][] = [
    ['Role', project.role],
    ['The problem', project.problem],
    ['Approach', project.approach],
    ['Methods', project.methods],
    ['Deliverables', project.deliverables],
    ['Outcomes', project.outcomes],
  ];
  const index = projects.findIndex((p) => p.id === project.id);
  const next = projects[(index + 1) % projects.length];

  return (
    <SiteFrame>
      <article>
        <section className="ab-page-head">
          <div className="ab-wrap">
            <p className="ab-proj-context">{project.context}</p>
            <h1>{project.title}</h1>
          </div>
        </section>
        <div className="ab-wrap">
          <figure className="ab-project-figure">
            <img src={project.image} alt={project.imageAlt} />
            {project.content && <figcaption>{project.content}</figcaption>}
          </figure>
          <dl className="ab-facts">
            {facts
              .filter(([, value]) => Boolean(value))
              .map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>
                    {(value as string).split(/\n{2,}/).map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </dd>
                </div>
              ))}
          </dl>
          {project.externalLink && project.externalLinkText && (
            <p className="ab-ext">
              <a href={project.externalLink} target="_blank" rel="noopener noreferrer">{project.externalLinkText}</a>
            </p>
          )}
          <p className="ab-next">
            Next: <Link to={`/project/${next.id}`}>{next.title}</Link>
          </p>
        </div>
      </article>
    </SiteFrame>
  );
};

export default ProjectPage;
