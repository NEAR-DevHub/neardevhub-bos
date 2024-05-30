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
    text-align: justify;
  }

  h3 {
    color: #151515;
    font-size: 1.5rem;
    font-style: normal;
    font-weight: 700;
    line-height: 120%;

    margin-top: 1rem;
  }

  h4 {
    color: #151515;
    font-size: 1.25rem;
    font-weight: 400;
    line-height: 150%;
  }

  li {
    text-align: justify;
  }

  ol li {
    font-size: 1.25rem;
  }
`;

return (
  <>
    {/* <Widget src={`${REPL_DEVHUB}/widget/devhub.components.island.banner`} /> */}
    <Section>
      {/* <h2>
        What is <span style={{ color: "#00EC97" }}>near</span>/dev/hub?
      </h2> */}

      <div>
        <p>
          Welcome to the Events Committee page! We are a cross-team organization
          responsible for hosting and sponsoring developer-focused events online
          and IRL for the benefit of the global Near ecosystem.
        </p>

        <h2>Our Groups:</h2>
        <p></p>

        <h3>1. Working Group:</h3>
        <p>
          Our formal Working Group comprises seasoned experts who meticulously
          evaluate proposals and make official decisions regarding hackathons
          and technical events within the NEAR ecosystem. This dedicated team
          follows a rigorous process to review submissions, recommend funding
          allocations to NEAR Foundation, and ensure accountability among grant
          recipients. Engaging with the wider community, they actively solicit
          feedback, fostering a culture of collaboration and innovation.
        </p>
        <p>
          <h4>Member organizations:</h4>
          <ul>
            <li> NEAR Foundation</li>
            <li>DevHub</li>
            <li>NEAR HZN</li>
            <li>Aurora</li>
            <li>Calimero</li>
            <li>Proximity</li>
            <li>NEARWEEK</li>
          </ul>
        </p>

        <h3>2. Community Group:</h3>
        <p>
          Our informal Community Group is a dynamic space where enthusiasts come
          together to brainstorm and execute ideas for developer-focused events.
          While this group doesn't make official decisions, it provides an
          invaluable platform for ideation, discussion, and collaboration. Led
          by passionate individuals, it operates autonomously, ensuring
          inclusivity and diversity of thought.
        </p>

        <p>
          <h4>Communication Channels:</h4>
          <ul>
            <li>
              {" "}
              DevHub Hacks Community Group on Telegram (
              <a href="https://t.me/neardevhubhacks" target="_blank">
                https://t.me/neardevhubhacks
              </a>
              ){" "}
            </li>
          </ul>
        </p>

        <h4>How to Get Involved:</h4>
        <ol>
          <li>
            Join Telegram: Dive into our dedicated Telegram group to stay
            updated on discussions and activities. Introduce yourself and become
            part of the conversation!
          </li>
          <li>
            Engage on the Proposal Feed: Participate in discussions, share your
            insights, or propose new ideas to contribute to our vibrant
            community.
          </li>
          <li>Volunteer: Step up to host your own developer focused event!</li>
        </ol>

        <p>
          Join us as we hack our way towards a better tomorrow. Together, let's
          innovate, collaborate, and shape the future of blockchain technology!
        </p>
      </div>
    </Section>
  </>
);
