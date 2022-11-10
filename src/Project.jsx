import './Project.css';

const Project = ({project})=>{
    return (
	<li className="project col-xs-12 col-md-6 ">
	    <div className="row shadow reverse card round">
	    <div className="imageWrapper no-padding col-xs-12 col-sm-6">
		<a href={project.url}>
		    <img className="shadow round" src={`/projects/${project.imageURL}`} alt={project.name}/>
		</a>
	    </div>
	    <div className="col-xs-12 col-sm-6">
		<h3>{project.name}</h3>
		<p>{project.desc}</p>
		<p className="technologies">
		    {project.technologiesUsed.map((t,i) => <span key={t}>{(i ? ', ' : '')+t}</span>)}
		</p>
		<a href={project.url}>{project.url}</a>
	    </div>
		</div>
	</li>
    );
}

export default Project;
