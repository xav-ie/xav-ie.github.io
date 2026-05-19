import './Footer.css';

const Footer = () => {
  return (
    <footer className="shadow section">
      <div className="footerInner">
        <div className="col-xs-12">
          <h2>Site Map</h2>
          <ul className="no-bullets">
            <li><a href="#about_me">About Me</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#oss">Open-Source</a></li>
            <li><a href="#doodles">Doodles</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
