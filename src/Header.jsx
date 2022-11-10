import './Header.css';
import ThemeToggle from './ThemeToggle';
import Logo from "./Logo"

const Header = ()=>{
    return (
	<>
	    <header>
		<Logo/>
		<div className="title">
		    <h1>Xavier Ruiz</h1>
		    <h2>Software Developer</h2>
		</div>
	    </header>
	    <nav className="row no-margin middle-xs shadow">
		<ul className="header-links no-margin">
		    <li>
			<a href="#about_me">
			    #about_me
			</a>
		    </li>
		    <li>
			<a href="#projects">
			    #projects
			</a>
		    </li>
		    <li>
			<a href="#doodles">
			    #doodles
			</a>
		    </li>

		</ul>
		
	    </nav>
	    <div className="theme-toggle-wrapper">
		<ThemeToggle/>
	    </div>

	</>
    );
}

export default Header;
