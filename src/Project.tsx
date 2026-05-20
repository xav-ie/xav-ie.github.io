import { useRef } from 'react';
import './Project.css';

export type ProjectData = {
  name: string;
  date: string;
  desc: string;
  technologiesUsed: string[];
  url: string;
  imageURL?: string;
};

const isVideo = (url: string) => /\.(mp4|webm|mov)$/i.test(url);

const Project = ({ project }: { project: ProjectData }) => {
  const isExternal = /^https?:\/\//.test(project.url);
  const linkProps = isExternal
    ? { target: '_blank', rel: 'noreferrer' }
    : {};
  const videoRef = useRef<HTMLVideoElement>(null);
  const useVideo = !!project.imageURL && isVideo(project.imageURL);
  const handleEnter = () => {
    void videoRef.current?.play().catch(() => {});
  };
  const handleLeave = () => {
    videoRef.current?.pause();
  };

  return (
    <li className="project col-xs-12 col-md-6">
      <div className="shadow card round">
        <div className="cardImage">
          <a href={project.url} {...linkProps}>
            {project.imageURL ? (
              <div
                className="shadow round image-frame"
                onMouseEnter={useVideo ? handleEnter : undefined}
                onMouseLeave={useVideo ? handleLeave : undefined}
              >
                {useVideo ? (
                  <video
                    ref={videoRef}
                    src={`/projects/${project.imageURL}#t=0.1`}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-label={project.name}
                  />
                ) : (
                  <img
                    src={`/projects/${project.imageURL}`}
                    alt={project.name}
                  />
                )}
              </div>
            ) : (
              <div className="shadow round projectPlaceholder" aria-hidden="true">
                <span className="projectPlaceholderText">
                  {project.name.toLowerCase().replace(/\s+/g, '-')}
                </span>
              </div>
            )}
          </a>
        </div>
        <div className="cardContent">
          <h3>{project.name}</h3>
          <p className="date">{project.date}</p>
          <p>{project.desc}</p>
          <p className="technologies">
            {project.technologiesUsed.map((t, i) => (
              <span key={t}>{(i ? ', ' : '') + t}</span>
            ))}
          </p>
          <a href={project.url} {...linkProps}>{project.url}</a>
        </div>
      </div>
    </li>
  );
};

export default Project;
