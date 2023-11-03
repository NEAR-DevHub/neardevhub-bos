const PageHeader = styled.h2`
  color: #555555;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 120%; /* 28.8px */
  letter-spacing: -0.24px;

  width: 100%;
  padding: 1rem 3.125rem;
  margin-left: auto;
  //background: #fff;

  margin-top: 1.5rem;
  margin-bottom: 1.5rem;

  @media screen and (max-width: 786px) {
    padding: 1rem;
  }
`;

const Section = styled.div`
  padding: 1.5rem 8rem;
  display: flex;
  flex-direction: column;

  display: flex;
  flex-direction: column;

  gap: 2rem;

  @media screen and (max-width: 786px) {
    padding: 1rem;
  }

  h2 {
    color: #151515;
    font-size: 2rem;
    font-style: normal;
    font-weight: 700;
    line-height: 2rem; /* 55.556% */

    margin: 1rem;
    margin-left: 0;
  }

  p {
    color: #151515;
    font-size: 1.25rem;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
    margin-bottom: 1rem;
  }

  h3 {
    color: #151515;
    font-size: 1.5rem;
    font-style: normal;
    font-weight: 700;
    line-height: 120%;

    margin-top: 1rem;
  }
`;

return (
  <>
    <Widget src={`${REPL_DEVHUB}/widget/devhub.components.island.banner`} />
    <Section>
      <h2>
        What is <span style={{ color: "#00EC97" }}>near</span>/dev/hub?
      </h2>

      <div>
        <p>
          DevHub brings together individuals, projects, and organizations to
          build a decentralized NEAR developer ecosystem. We provide social
          structure and tools to fuel innovation, collaboration, and community
          within the NEAR ecosystem. Whether you’re a blockchain developer or
          advocate for the open web, DevHub is your gateway to making a
          meaningful impact on NEAR and beyond.
        </p>

        <h3>Mission</h3>
        <p>
          Build a self-sufficient developer community to enable a thriving NEAR
          ecosystem.
        </p>

        <h3>Values</h3>
        <p>
          <ul>
            <li>
              <b>Decentralized</b>: We are building together.
            </li>
            <li>
              <b>Transparent</b>: All decision making and communication is open.
            </li>
            <li>
              <b>Self-sufficient</b>: We do not critically depend on any single
              entity.
            </li>
            <li>
              <b>Robust</b>: Any role or team can be duplicated or replaced.
            </li>
            <li>
              <b>High-velocity</b>: We need to move faster than classic OSS.
            </li>
          </ul>
        </p>

        <h3>Scope</h3>
        <p>
          DevHub covers a wide range of areas to support the NEAR developer
          ecosystem, including:
          <ul>
            <li>
              <b>Developer Tooling</b>: Contributing code to the NEAR Platform
              (blockchain and devtools) and facilitating technical decisions
              with recognized experts based on the needs of the community and
              ecosystem.
            </li>
            <li>
              <b>Developer Relations</b>: Engaging with the community across
              various social channels, gathering feedback, and improving
              documentation.
            </li>
            <li>
              <b>Deep-Tech Awareness</b>: Working with marketing partners to
              create awareness on interesting projects and technology areas.
            </li>
            <li>
              <b>Events and Hackathons</b>: Organizing events and empowering
              community leaders with resources to grow their local communities.
            </li>
            <li>
              <b>Education</b>: Partnering with universities across the globe to
              support students and scholars in exploring Web3 technologies
            </li>
            <li>
              <b>Platform</b>: Developing DevHub platform as a product to enable
              communities to collaborate and support each other.
            </li>
          </ul>
        </p>

        <h3>Our Contributors</h3>
        <p>
          DevHub operates through DevDAO, which provides social structures to
          support developers. Within DevDAO, we have a dedicated core team of
          moderators and community contributors who work across the key areas
          above. We welcome contributions from any community members who want to
          join us in building our ecosystem and their own skills!
        </p>

        <h3>Our Platform</h3>
        <p>
          Our main tool for interfacing is the DevHub Platform, where you can
          connect with others, share ideas and solutions, and access resources
          and support. You can also find communities working on a variety of
          areas, from protocol development to tooling and documentation.
        </p>

        <h3>Join Us in Shaping NEAR’s Future</h3>
        <p>
          Regardless of your background or where you are on your developer
          journey, we’re happy you’re here! We hope you’ll explore, find your
          people, and discover paths to contribute that are most gratifying for
          you.
          <br />
          Let’s build the open web together.
        </p>
      </div>
    </Section>
  </>
);
