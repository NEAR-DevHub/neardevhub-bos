const Header = styled.div`
  //background: white;
  padding: 1rem 3.125rem;
  width: 100%;
  margin: 24px; 

  @media screen and (max-width: 768px) {
    margin: 1rem 0;
    padding: 1rem;
  }
`;

const PageHeader = styled.h2`
  color: #00ec97;
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 400;
  line-height: 120%; /* 28.8px */
  letter-spacing: -0.24px;
  margin: 0;
`;

const Lead = styled.h5`
  color: #151515;
  font-size: 2.5rem;
  font-style: normal;
  font-weight: 700;
  line-height: 120%; /* 48px */
  margin: 2.25rem 8rem;
  margin-top: 0;

  @media screen and (max-width: 768px) {
    font-size: 1.75rem;
    margin: 1rem;
    margin-top: 0;
  }
`;

const Container = styled.div`
  padding: 2.25rem 8rem;
  width: 100%;
  //background-color: white;

  @media screen and (max-width: 768px) {
    padding: 1rem;
  }
`;

const actions = [
  {
    title: "Propose an idea",
    description:
      "DevHub caters to a niche audience of open-source developers motivated by technology and a strong sense of community. They are driven by personal goals and the desire to contribute to the common good and actively participate in the NEAR community.",
    ctaAction: "Action button →",
    ctaLink: "#",
  },
  {
    title: "Build a solution",
    description:
      "DevHub caters to a niche audience of open-source developers motivated by technology and a strong sense of community. They are driven by personal goals and the desire to contribute to the common good and actively participate in the NEAR community.",
    ctaAction: "Action button →",
    ctaLink: "#",
  },
  {
    title: "Host an Event",
    description:
      "DevHub caters to a niche audience of open-source developers motivated by technology and a strong sense of community. They are driven by personal goals and the desire to contribute to the common good and actively participate in the NEAR community.",
    ctaAction: "Action button →",
    ctaLink: "#",
  },
  {
    title: "Improve NEAR Docs",
    description:
      "DevHub caters to a niche audience of open-source developers motivated by technology and a strong sense of community. They are driven by personal goals and the desire to contribute to the common good and actively participate in the NEAR community.",
    ctaAction: "Action button →",
    ctaLink: "#",
  },
  {
    title: "Propose an idea",
    description:
      "DevHub caters to a niche audience of open-source developers motivated by technology and a strong sense of community. They are driven by personal goals and the desire to contribute to the common good and actively participate in the NEAR community.",
    ctaAction: "Action button →",
    ctaLink: "#",
  },
  {
    title: "Propose an idea",
    description:
      "DevHub caters to a niche audience of open-source developers motivated by technology and a strong sense of community. They are driven by personal goals and the desire to contribute to the common good and actively participate in the NEAR community.",
    ctaAction: "Action button →",
    ctaLink: "#",
  },
  {
    title: "Propose an idea",
    description:
      "DevHub caters to a niche audience of open-source developers motivated by technology and a strong sense of community. They are driven by personal goals and the desire to contribute to the common good and actively participate in the NEAR community.",
    ctaAction: "Action button →",
    ctaLink: "#",
  },
];

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  h5 {
    color: #151515;
    font-size: 1.75rem;
    font-style: normal;
    font-weight: 400;
    line-height: 120%; /* 43.2px */

    display: flex;
    align-items: center;
  }

  p {
    color: #000;
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
    line-height: 120%; /* 28.8px */
  }

  a {
    color: #f4f4f4;
    font-size: 1rem;
    font-style: normal;
    font-weight: 700;
    line-height: 120%; /* 28.8px */
    letter-spacing: -0.48px;

    display: flex;
    padding: 0.5rem 1rem;
    align-items: center;
    gap: 8px;

    border-radius: 0.5rem;
    background: #00ec97;

    width: max-content;
  }
`;
const ActionCard = ({ action, index }) => {
  return (
    <Card>
      <h5>
        <span
          style={{
            color: "#151515",
            border: "2px #151515 solid",
            fontSize: 12,
            padding: 4,
            width: 22,
            height: 22,
          }}
          className="rounded-circle d-flex align-items-center justify-content-center me-1"
        >
          {index}
        </span>
        {action.title}
      </h5>
      <p>{action.description}</p>
      <a href={action.ctaLink}>{action.ctaAction}</a>
    </Card>
  );
};

const ActionContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  justify-content: center;
  gap: 1rem;

  width: 100%;

  @media screen and (max-width: 768px) {
    display: flex;
    flex-direction: column;
  }
`;

return (
  <>
    <Widget
      src={`${REPL_DEVHUB}/widget/devhub.components.island.banner`}
      props={{
        title: (
          <>
            We are building <br />
            <span style={{ color: "#151515" }}>
              a decentralized community
            </span>{" "}
            <br />
            for NEAR Developers.
          </>
        ),
        imageLink:
          "https://ipfs.near.social/ipfs/bafybeiap2mzwsly4apaldxguiunx4rjwqyadksj5yxuzwrww3kue3ao5qe",
      }}
    />
    <Header>
      <PageHeader>/contribute</PageHeader>
    </Header>
    <Lead>
      There are many ways to start your contribution journey. You can:
    </Lead>
    <Container>
      <ActionContainer>
        {actions.map((action, index) => (
          <ActionCard action={action} index={index} />
        ))}
      </ActionContainer>
    </Container>
  </>
);
