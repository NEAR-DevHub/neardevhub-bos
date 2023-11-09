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

const PageHeader = styled.h1`
  color: #555555;
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 500;
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
    title: "Ideate on DevHub",
    description:
      "The first step in any NEAR ecosystem project is ideation. It is crucial to have a way to find people to share and explore ideas with, partly because it can save a lot of time based on prior discussions. But also because it can you gauge support from a diversity of stakeholders.",
    ctaAction: "Learn More →",
    ctaLink: "/devhub.near/widget/app?page=blog&id=2029",
  },
  {
    title: "Post a Proposal",
    description:
      "If you have already nurtured and refined your idea, you're ready to draft and post your funding proposal.This guide is here to help you craft a compelling, convincing, and concise proposal that will capture the interest of potential funders.",
    ctaAction: "Learn More →",
    ctaLink: "/devhub.near/widget/app?page=blog&id=2035",
  },
  {
    title: "Host an Event",
    description:
      "We are always on the lookout for events that align with our mission and provide value to the NEAR ecosystem. If you are organizing such an event, we would love to hear from you! Below is a guide on how to submit a sponsorship proposal to us.",
    ctaAction: "Learn More →",
    ctaLink: "/devhub.near/widget/app?page=community&handle=hacks&tab=Wiki%202",
  },
  {
    title: "Improve NEAR Docs",
    description:
      "NEAR documentation is an open source repository that anyone can fork, extend and contribute to by creating pull requests. To get started, head over to our github repository and checkout how you can make your first contribution. ",
    ctaAction: "Learn More →",
    ctaLink: "https://github.com/near/docs",
  },
  {
    title: "Join the Fellowship",
    description:
      "As the NEAR ecosystem grows rapidly, there is an increasing need to improve developer productivity. The DevDAO NEAR Platform Fellowship Program aims to solve this issue by providing guidance to new contributors from experienced developers.",
    ctaAction: "Learn More →",
    ctaLink:
      "/devhub.near/widget/app?page=community&handle=fellowship&tab=Wiki 1",
  },
  {
    title: "Join NEAR Campus",
    description:
      "DevHub’s NEAR Campus supports existing student clubs, researchers, and faculties in blockchain technologies, enhancing both curricular and extracurricular activities. We aim to merge blockchain education with mainstream academics.",
    ctaAction: "Learn More →",
    ctaLink: "/devhub.near/widget/app?page=community&handle=near-campus",
  },
  {
    title: "Dive into Hackbox",
    description:
      "Hackbox is a revolutionary plug-and-play solution designed to empower local leads and community stewards in hosting hackathons easily and efficiently.",
    ctaAction: "Learn More →",
    ctaLink: "/hackbox.near/widget/home",
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
          {index + 1}
        </span>
        {action.title}
      </h5>
      <p>{action.description}</p>
      <a href={action.ctaLink} target="no_blank">
        {action.ctaAction}
      </a>
    </Card>
  );
};

const ActionContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  justify-content: center;
  column-gap: 1rem;
  row-gap: 2rem;

  width: 100%;

  @media screen and (max-width: 768px) {
    display: flex;
    flex-direction: column;
  }
`;

return (
  <>
    <Widget src={`${REPL_DEVHUB}/widget/devhub.components.island.banner`} />
    <Header>
      <PageHeader>Contribute</PageHeader>
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
