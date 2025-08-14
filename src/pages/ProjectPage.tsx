import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProjectById } from '../data/projects';
import BackButton from '../components/BackButton';
import ResponsiveImage from '../components/ResponsiveImage';

const ProjectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const project = id ? getProjectById(id) : undefined;

  if (!project) {
    return (
      <div className="page-container">
        <div className="page-content">
          <h1 className="page-title">Project not found</h1>
          <p>
            <Link to="/work" className="link-text">
              ← Back to work
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <BackButton />

      <div className="page-container">
        <div className="page-content">
          <ResponsiveImage 
            src={project.image} 
            alt={project.imageAlt} 
            className="page-image"
            loading="eager"
            sizes="(max-width: 768px) 100vw, 800px"
          />
          <div className="page-header">
            <h1 className="page-title">{project.title}</h1>
            {project.content && <p>{project.content}</p>}
          </div>

          {project.role && (
            <p><b>My Role:</b> {project.role}</p>
          )}

          {project.problem && (
            <>
              <br />
              <p><b>The Problem:</b> {project.problem}</p>
            </>
          )}

          {project.approach && (
            <>
              <br />
              <p><b>Approach:</b> {project.approach}</p>
            </>
          )}

          {project.methods && (
            <>
              <br />
              <p style={{whiteSpace: 'pre-line'}}><b>The Methods:</b> {project.methods}</p>
            </>
          )}

          {project.deliverables && (
            <>
              <br />
              <p style={{whiteSpace: 'pre-line'}}><b>The Deliverables:</b> {project.deliverables}</p>
            </>
          )}

          {project.outcomes && (
            <>
              <br />
              <p style={{whiteSpace: 'pre-line'}}><b>The Outcomes:</b> {project.outcomes}</p>
            </>
          )}

          {project.externalLink && project.externalLinkText && (
            <>
              <br />
              <p>
                <a className="link-text" href={project.externalLink} target="_blank" rel="noopener noreferrer">
                  {project.externalLinkText}
                </a>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ProjectPage; 