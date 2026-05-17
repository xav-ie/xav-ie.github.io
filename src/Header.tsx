import './Header.css';

const Header = () => {
  return (
    <>
      <header>
        <div className="logo">
          <object id="heart" type="image/svg+xml" data="/heart.svg">
            Your browser does not support SVG
          </object>
        </div>
        <div className="title">
          <h1>Xavier Ruiz</h1>
          <h2>Software Developer</h2>
        </div>
      </header>
      <nav className="row no-margin middle-xs shadow">
        <ul className="header-links no-margin">
          <li>
            <a href="#about_me">#about_me</a>
          </li>
          <li>
            <a href="#projects">#projects</a>
          </li>
          <li>
            <a href="#doodles">#doodles</a>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Header;
