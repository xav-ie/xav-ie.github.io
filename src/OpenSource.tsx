import './OpenSource.css';

type Contribution = {
  repo: string;
  url: string;
  summary: string;
};

const contributions: Contribution[] = [
  {
    repo: 'atuinsh/atuin',
    url: 'https://github.com/atuinsh/atuin/pulls?q=author%3Axav-ie',
    summary: 'Brought Nushell support to `atuin hex` and OSC 7 cwd mirroring',
  },
  // PRs to royshil/obs-backgroundremoval are still pending review; uncomment once merged.
  // {
  //   repo: 'royshil/obs-backgroundremoval',
  //   url: 'https://github.com/royshil/obs-backgroundremoval/pulls?q=author%3Axav-ie',
  //   summary: 'Cut preprocessing latency by 73%',
  // },
  {
    repo: 'agentstation/vhs',
    url: 'https://github.com/agentstation/vhs/pulls?q=author%3Axav-ie',
    summary: 'Fixed SVG animation timing',
  },
  {
    repo: 'korotovsky/slack-mcp-server',
    url: 'https://github.com/korotovsky/slack-mcp-server/pull/141',
    summary: 'Integrated the Slack reactions API',
  },
  {
    repo: 'nolanderc/glsl_analyzer',
    url: 'https://github.com/nolanderc/glsl_analyzer/issues?q=author%3Axav-ie',
    summary: 'Created a CLI formatter',
  },
  {
    repo: 'catgoose/nvim-colorizer.lua',
    url: 'https://github.com/catgoose/nvim-colorizer.lua/pull/160',
    summary: 'Added oklch color highlighting',
  },
  {
    repo: 'Alexays/Waybar',
    url: 'https://github.com/Alexays/Waybar/pulls?q=author%3Axav-ie',
    summary: 'Fixed audio visualizer bugs',
  },
  {
    repo: 'lewis6991/gitsigns.nvim',
    url: 'https://github.com/lewis6991/gitsigns.nvim/pull/1400',
    summary: 'Fixed blame text overflow',
  },
  {
    repo: 'fzakaria/nix-auto-follow',
    url: 'https://github.com/fzakaria/nix-auto-follow/issues?q=author%3Axav-ie',
    summary: 'Fixed dependency duplication bugs',
  },
];

const OpenSource = () => {
  return (
    <div id="oss" className="col-xs-12 section">
      <h2>Open-Source Contributions</h2>
      <ul className="row no-bullets oss-list">
        {contributions.map((c) => (
          <li key={c.repo} className="col-xs-12 col-md-6 oss-item">
            <a
              className="oss-card shadow round"
              href={c.url}
              target="_blank"
              rel="noreferrer"
            >
              <span className="oss-repo">{c.repo}</span>
              <span className="oss-summary">{c.summary}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OpenSource;
