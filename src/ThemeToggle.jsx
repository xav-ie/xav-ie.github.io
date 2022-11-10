import { useState, useEffect } from 'react';
import './ThemeToggle.css';

const ThemeToggle = () => {
    const [theme, setTheme] = useState('light');

    const updateTheme = (t) => {
	setTheme(t);
        document.documentElement.setAttribute('data-theme', t);
	localStorage.setItem('theme', t); 
    }
    
    const toggleTheme = () => {
	if(theme === 'light') {
	    updateTheme('dark');
	} else{
	    updateTheme('light');
	}
    }
    useEffect(() => {
	if(localStorage.getItem('theme')) {
	    updateTheme(localStorage.getItem('theme'));
	} else {
	    const windowTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? 'dark' : 'light';
	    updateTheme(windowTheme);
	}
    }, []);
    
    return (<button onClick={toggleTheme} className="shadow round">{"Switch to "+(theme==='light'?'dark':'light')+" theme"}</button>);
}

export default ThemeToggle;
