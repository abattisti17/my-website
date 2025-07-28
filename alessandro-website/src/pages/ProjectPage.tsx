import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProjectById } from '../data/projects';

const ProjectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const project = id ? getProjectById(id) : undefined;

  if (!project) {
    return (
      <div className="frame">
        <div className="main">
          <h1>Project not found</h1>
          <p>
            <Link to="/work" className="link-text">
              &lt;- Back to work
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="floating-back-link">
        <p>
          <Link to="/" className="link-text">
            &lt;- Back to home
          </Link>
        </p>
      </div>

      <div className="frame">
        <div className="main">
          <img src={project.image} alt={project.imageAlt} />
          
          <h2>{project.title}</h2>
          {project.content && <p>{project.content}</p>}

          {project.role && (
            <p><b>My Role:</b> {project.role}</p>
          )}

          {project.problem && (
            <p><b>The Problem:</b> {project.problem}</p>
          )}

          {project.approach && (
            <p><b>Approach:</b> {project.approach}</p>
          )}

          {project.methods && (
            <p><b>The Methods:</b> {project.methods}</p>
          )}

          {project.deliverables && (
            <p><b>The Deliverables:</b> {project.deliverables}</p>
          )}

          {project.outcomes && (
            <p><b>The Outcomes:</b> {project.outcomes}</p>
          )}

          {project.externalLink && project.externalLinkText && (
            <h3>
              <a className="link-text" href={project.externalLink} target="_blank" rel="noopener noreferrer">
                {project.externalLinkText}
              </a>
            </h3>
          )}
        </div>
      </div>
    </>
  );
};

export default ProjectPage; 