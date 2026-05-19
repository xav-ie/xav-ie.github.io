import 'flexboxgrid/css/flexboxgrid.min.css';
import './App.css';
import Header from './Header';
import Footer from './Footer';
import AboutMe from './AboutMe';
import Projects from './Projects';
import OpenSource from './OpenSource';
import Doodles from './Doodles';

const App = () => {
  return (
    <div className="App">
      <Header />
      <main>
        <AboutMe />
        <Projects />
        <OpenSource />
        <Doodles />
      </main>
      <Footer />
    </div>
  );
};

export default App;
