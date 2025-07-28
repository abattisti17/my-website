import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../data/projects';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="project-card">
      <hr />
      <img 
        className="project-banner" 
        src={project.image} 
        alt={project.imageAlt} 
      />
      <p>
        <Link to={`/project/${project.id}`} className="link-text">
          {project.title}
        </Link>
      </p>
      <h3>
        {project.problem && <><b>Problem:</b> {project.problem}<br /><br /></>}
        {project.method && <><b>Methods:</b> {project.method}<br /><br /></>}
        {project.solution && <><b>Deliverable:</b> {project.solution}<br /><br /></>}
        {project.outcome && <><b>Outcome:</b> {project.outcome}<br /><br /></>}
      </h3>
    </div>
  );
};

export default ProjectCard; 