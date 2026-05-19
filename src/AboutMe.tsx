import "./AboutMe.css";

const AboutMe = () => {
  return (
    <div id="about_me" className="col-xs-12 section">
      <h2>About Me</h2>
      <div className="row">
        <div className="col-xs-12 col-sm-4 col-lg-3">
          <div className="profileImage shadow round image-frame">
            <img src="/me.jpg" alt="Xavier Ruiz" />
          </div>
        </div>
        <div className="col-xs-12 col-sm-8 col-lg-6 bio">
          <p>
            Hi, I'm Xavier and I live in Boston. I currently work in the
            e-commerce space, building tools to make stores fast, accessible,
            and well-tested. In my free time, I like to play board games, try
            new foods, and fiddle with my dotfiles.
          </p>
          <p>
            I also help run <a href="https://bostonts.club">bostonts.club</a>, a
            monthly meetup for all things TypeScript and web development.
          </p>
          <p>
            You can reach me at <a href="mailto:hello@xav.ie">hello@xav.ie</a>,
            or find me on <a href="https://github.com/xav-ie">GitHub</a> and{" "}
            <a href="https://www.linkedin.com/in/xav-ie/">LinkedIn</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;
