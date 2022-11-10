import './AboutMe.css';

const AboutMe = ()=>{
    return (
	<div className="row">
	    <div className="col-xs-12 section" id="about_me">
		<div className="row">
		    <div className="col-xs-12">
			<h2>About Me</h2>
		    </div>
		</div>
		<div className="row">
		    <div className="col-xs-12 col-md-4 col-lg-3 start-xs center-md">
			<img
			    className="profileImage round shadow"
			    src="/me.jpg"
			    alt="A goofy Xavier"
			/>
		    </div>
		    <div className="col-xs-12 col-md-8 col-lg-6 bio">
			<p>
			    Hello! I'm Xavier and I love programming. I am president of <a href="https://builds.cc">BUILDS</a>. I am also working on the front-ends of <a href="https://bostonhacks.io">BostonHacks</a> and <a href="https://hackbeanpot.com/">HackBeanpot</a>. My interests include SVGs & animating them,  React, animating with <a href="https://www.react-spring.io/">React Spring</a>, Amazon AWS, and containerizing applications with Docker.
			</p>
			<p>My resumé can be found at <a href="/r.pdf">/resumé.pdf</a>.</p>
			<p>
			    The best way to reach me is via email: <a href="mailto:xruiz@bu.edu">xruiz@bu.edu</a>
			</p>
			<p>
			    I also have public <a href="https://www.linkedin.com/in/xav-ie/">LinkedIn</a> and <a href="https://github.com/xav-ie">GitHub</a> profiles.
			</p>
		    </div>
		</div>
	    </div>

	</div>
    );
}

export default AboutMe;
