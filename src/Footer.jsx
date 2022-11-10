import './Footer.css';

const Footer = ()=>{
    return (
	<footer className="shadow section">
	    <h2>Site Map</h2>
	    <ul className="no-bullets">
		<li><a href="#about_me">About Me</a></li>
		<li><a href="#projects">Projects</a></li>
		<li><a href="#doodles">Doodles</a></li>
		<li><a target="_blank" href="/r.pdf">Resumé</a></li>
	    </ul>
	</footer>
    );
}

export default Footer;
