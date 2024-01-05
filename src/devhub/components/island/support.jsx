const Items = [
  {
    heading: (
      <>
        Developer
        <br />
        Resources
      </>
    ),
    description: "Learn the fundamentals of NEAR and build with confidence",
    cta: {
      href: "https://docs.near.org",
      title: "Read ↗",
    },
  },
  {
    heading: <>Office Hours</>,
    description: (
      <>
        Need some help?
        <br /> DevRel contributors are available to answer your technical
        questions
      </>
    ),
    cta: {
      href: "/devhub.near/widget/app?page=community&handle=devrel&tab=office-hours-support",
      title: "Join ↗",
    },
  },
  {
    heading: <>Get Funding</>,
    description:
      "Explore funding opportunities from DevHub to fuel your vision",
    cta: {
      href: "/devhub.near/widget/app?page=community&handle=developer-dao&tab=funding",
      title: "Learn more ↗",
    },
  },
];

const Circle = styled.div`
  display: flex;
  width: 18.75rem;
  height: 18.75rem;
  padding: 2.25rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;

  border-radius: 22.5rem;
  border: 1px solid #00ec97;
  background: #f4f4f4;

  h3 {
    color: #101820;
    text-align: center;
    font-size: 1.75rem;
    font-style: normal;
    font-weight: 700;
    line-height: 100%; /* 36px */
  }

  p {
    color: #101820;
    text-align: center;
    font-size: 1.125rem;
    font-style: normal;
    font-weight: 400;
    line-height: 120%; /* 28.8px */
    letter-spacing: -0.72px;
  }

  a {
    color: #555555;
    font-size: 1.125rem;
    font-style: normal;
    font-weight: 700;
    line-height: 120%; /* 28.8px */
  }
`;

const Container = styled.div`
  padding: 3rem;
  padding-top: 0;
  margin-top: 1.5rem;

  @media screen and (max-width: 786px) {
    padding: 1.5rem;
    padding-top: 0;
  }
`;

const ItemsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;

  flex-wrap: wrap;
  gap: 3rem;

  @media screen and (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const Content = (
  <Container>
    <ItemsContainer>
      {Items.map((it) => (
        <Circle key={Math.random()}>
          <h3>{it.heading}</h3>
          <p>{it.description}</p>
          <a href={it.cta.href}>{it.cta.title}</a>
        </Circle>
      ))}
    </ItemsContainer>
  </Container>
);

return (
  <Widget
    src="${REPL_DEVHUB}/widget/devhub.components.island.home-section"
    props={{
      title: "/get support",
      children: Content,
      background: true,
    }}
  />
);
