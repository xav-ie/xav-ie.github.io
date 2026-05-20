import './Header.css';
import GodRays from './GodRays';
import HeartGoldSvg from './HeartGoldSvg';

const Header = () => {
  return (
    <>
      <div className="header-bleed">
        <GodRays />
        <header>
          <div className="col-xs-12 headerInner">
            <div className="logo">
              <HeartGoldSvg size="7em" title="Heart" />
            </div>
            <div className="title">
              <h1>Xavier Ruiz</h1>
              <h2>Software Developer</h2>
            </div>
          </div>
        </header>
      </div>
      <nav className="row no-margin middle-xs shadow">
        <ul className="header-links col-xs-12">
          <li>
            <a href="#about_me">#about_me</a>
          </li>
          <li>
            <a href="#projects">#projects</a>
          </li>
          <li>
            <a href="#oss">#oss</a>
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
