import Project, { type ProjectData } from './Project';
import { useMasonry } from './useMasonry';

const artAndDoodles: ProjectData[] = [
  {
    name: 'Smart Rockets',
    date: 'May 2020',
    desc: "Little rockets 'learn' to hit a target through a genetic algorithm. Each generation is mutated from the fittest rockets of the last. Adapted from a Dan Shiffman tutorial.",
    technologiesUsed: ['JavaScript', 'p5.js'],
    url: '/projects/smart-rockets',
    imageURL: 'rockets.mp4',
  },
  {
    name: 'Moiré Effect',
    date: 'August 2018',
    desc: 'Two sets of horizontal lines rotated against each other. The vertical lines that appear are an optical illusion — the Moiré effect.',
    technologiesUsed: ['JavaScript', 'p5.js'],
    url: '/projects/moire-squares',
    imageURL: 'display.mp4',
  },
  {
    name: 'Binary Numbers',
    date: 'March 2019',
    desc: 'A binary representation of a number, with the decimal in the center. Mouse events shift the bits left and right, or you can type a decimal and watch it convert.',
    technologiesUsed: ['JavaScript', 'p5.js'],
    url: '/projects/binary-numbers',
    imageURL: 'capture.PNG',
  },
  {
    name: 'Pong',
    date: 'May 2019',
    desc: 'Two-player Pong. WASD for player one, arrow keys for player two.',
    technologiesUsed: ['JavaScript', 'p5.js'],
    url: '/projects/pong',
    imageURL: 'capture.mp4',
  },
  {
    name: 'Raycasting',
    date: 'May 2019',
    desc: 'A raycasting demo following Dan Shiffman. Not original work, but a satisfying one to step through.',
    technologiesUsed: ['JavaScript', 'p5.js'],
    url: '/projects/raycasting',
    imageURL: 'opt.mp4',
  },
];

const Doodles = () => {
  const gridRef = useMasonry<HTMLUListElement>();

  return (
    <div id="doodles" className="col-xs-12 section">
      <h2>Art and Doodles</h2>
      <ul ref={gridRef} className="row no-bullets masonry-grid">
        {artAndDoodles.map((p) => <Project key={p.name} project={p} />)}
      </ul>
    </div>
  );
};

export default Doodles;
