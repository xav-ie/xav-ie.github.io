import Project from './Project';

const longTermProjects = [
    {
        "name": "Tabby",
        "date": "Febrary 2022 - May 2022",
        "desc": "Ever wanted pets in your Emacs tab bar? Well with Tabby, now you can! Tabby adds virtual pets or GIFs to the Emacs tab bar. It is still a work in progress, but it hopes to emulate the Corgi mode that Google Colab and Kaggle offers.",
        "technologiesUsed": ["ELisp", "SVG", "GIF"],
        "url": "https://github.com/xav-ie/tabby",
        "imageURL": "corgi.png"
    },
    {
        "name": "Dichopter® Project",
        "date": "August 2018 - May 2021",
        "desc": "The Dichopter® Project aims to provide the user with hardware and software tools to help them explore dichoptic vision – that is, two eyed or binocular vision where two images are presented to the left and right eye separately. The Dichopter Project allows people to expolore 3D vision and perception of other physics simulations. I enjoyed this project because it required me to learn how to optimize web pages when dealing with lots of content. ",
        "technologiesUsed": ["JavaScript", "GitHub", "Progressive Web Apps", "Caching", "p5.js", "Materialize CSS"],
        "url": "https://dichopter.com",
        "imageURL": "viewer.jpg"
    },
    {
        "name": "TravelAnywhere",
        "date": "May 2020 - May 2021",
        "desc": "TravelAnywhere is an experiment and study of the travelling salesman problem, which is 'What is the most efficient way to go through a group of points of interest?'. I experimented with multiple algorithms for this including brute force, combinatorial, and genetic! Currently, it is the works to use an algorithm proposed in 1983 by Dumas et al.",
        "technologiesUsed": ["React", "Javascript", "Google Maps API"],
        "url": "https://github.com/xav-ie/tsp_react",
        "imageURL": "path.png"
    },
    {
        "name": "BostonHacks.io Website",
        "date": "January 2020 - Present",
        "desc": "BostonHacks is Boston's largest hackathon of 500+ hackers. I created and designed the landing page, SVGs, and animations used in the site. It uses Firebase as its backend and is a new project by the BostonHacks team.",
        "technologiesUsed": ["Vue", "Javascript", "SVG", "SMIL", "Firebase"],
        "url": "https://bostonhacks.io",
        "imageURL": "pinata.gif"
    },
    {
        "name": "BUILDS.cc Website",
        "date": "October 2020 - November 2020",
        "desc": "BUILDS is a Boston University hackerspace and club that is core to the BU Computer Science experience. The site is a simple Create-React-App site I built in a couple of days using styled-components, react-spring, react-router-dom, and flexbox grid. I had a a lot of fun on this because this is the fastest I have been able to make something so substantial.",
        "technologiesUsed": ["React", "styled-components", "react-router-dom", "react-spring", "Flexbox Grid"],
        "url": "https://builds.cc",
        "imageURL": "builds.png"
    },
    {
        "name": "Beaglenet AWS Backend",
        "date": "May 2020 - September 2020",
        "desc": "Beaglenet is a startup aiming to improve the world through occupancy monitoring. Founded by my friends and I, we have already gotten contracts with Boston University. My role in this project was to connect the monitoring devices to the AWS DynamoDB database and get them to properly record the desired information through AWS Lambda functions.",
        "technologiesUsed": ["Vue", "AWS", "DynamoDB", "Lambda", "IOT"],
        "url": "https://thebeaglenet.com",
        "imageURL": "beaglenet.png"
    }];


const artAndDoodles = [{
        "name": "Smart Rockets",
        "date": "May 2020",
        "desc": "This is an awesome little doodle where the rockets 'learn' to hit the red dot through a genetic algorithm. This means every new generation of rockets is from the previous version. I score the rockets based on how fit they are, and the goal is to hit the red dot in the fastest time possible. The fittest rockets are allowed to generate more children with a small amount of mutation so that the rockets may evolve to be faster. This is from a YouTube tutorial by Dan Shiffman. ",
        "technologiesUsed" : ["JavaScript", "p5.js"],
        "url": "/projects/smart-rockets",
        "imageURL": "rockets.gif"
    },
    {
        "name": "Moiré Effect",
        "date": "August 2018",
        "desc": "What you are seeing is actually just two sets of horizontal lines being rotated. The vertical lines that appear are an optical illusion, the Moiré effect.",
        "technologiesUsed" : ["JavaScript", "p5.js"],
        "url": "/projects/moire-squares",
        "imageURL": "display.gif"
    },
    {
        "name": "Binary Numbers",
        "date": "March 2019",
        "desc": "I got most of my code following a tutorial by Dan Shiffman. What this does is show a binary representation of a number through the dots at the top. The decimal representation is in the center. I modified it to respond to mouse events so users can shift the binary number left and right. You can also enter in a decimal number and it will automatically convert it to binary!",
        "technologiesUsed" : ["JavaScript", "p5.js"],
        "url": "/projects/binary-numbers",
        "imageURL": "capture.PNG"
    },
    {
        "name": "Pong",
        "date": "May 2019",
        "desc": "I remade Pong! This is two player, player one moves with WASD and player two moves with the arrow keys.",
        "technologiesUsed" : ["JavaScript", "p5.js"],
        "url": "/projects/pong",
        "imageURL": "capture.gif"
    },
    {
        "name": "Raycasting",
        "date": "May 2019",
        "desc": "Following a tutorial by Professor Dan Shiffman at NYU, I re-created the raycasting demo that he created. This is not my original work, but I hope to expand on his tutorial in the future and make a small game.",
        "technologiesUsed" : ["JavaScript", "p5.js"],
        "url": "/projects/raycasting",
        "imageURL": "opt.gif"
    }];


const Projects = ()=>{
    return (
	<>
	<div id="projects" className="section">
	    <h2>Projects</h2>
	    <ul className="row no-bullets">
		{longTermProjects.map((p,i) => <Project key={p.name} project={p}/>)} 
	    </ul>
	</div>
	<div id="doodles" className="section">
	    <h2>Art and Doodles</h2>
	    <ul className="row no-bullets">
		{artAndDoodles.map((p,i) => <Project key={p.name} project={p}/>)} 
	    </ul>
	</div>
	</>
    );
}

export default Projects;
