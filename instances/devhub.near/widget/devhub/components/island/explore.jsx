const Card = styled.div`
  display: flex;
  max-width: 20rem;
  max-height: 17.5rem;
  padding: 1.5rem;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  background: #fff;
  border-radius: 1rem;

  h3 {
    color: #555555; //#00ec97;
    text-align: center;
    font-size: 1.5rem;
    font-style: normal;
    font-weight: 700;
    line-height: 120%; /* 28.8px */
  }

  p {
    color: #555;
    text-align: center;
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
    line-height: 120%; /* 24px */
  }

  a {
    color: #555555; //#00ec97;
    text-align: center;
    font-size: 1.25rem;
    font-style: normal;
    font-weight: 700;
    line-height: 120%; /* 24px */
  }

  @media screen and (max-width: 768px) {
    h3 {
      font-size: 1.5rem;
    }

    p,
    a {
      font-size: 1rem;
    }

    padding: 1rem;
  }
`;

const SectionCard = ({ title, description, href }) => {
  return (
    <Card>
      <h3>{title}</h3>
      <p>{description}</p>
      <a href={href}>Learn more →</a>
    </Card>
  );
};

const Cards = [
  {
    title: "217 Validators",
    description:
      "to ensure security, liveness, and fault tolerance of the network",
    href: "https://nearscope.net/",
  },
  {
    title: "<1s, <1¢",
    description:
      "Fast and cost-efficient transactions. 1s to update values with minimal fees",
    href: "https://nearblocks.io/",
  },
  {
    title: "Awesome DevEx",
    description:
      "NEAR lets developers innovate with familiar tools: TypeScript, Rust, Solidity",
    href: "https://docs.near.org/",
  },
  {
    title: "Horizontal Scaling",
    description:
      "Nightshade ensures maximum performance thanks to its sharded design",
    href: "https://docs.near.org/concepts/advanced/papers",
  },
];

const CTA = styled.a`
  display: flex;
  padding: 0.875rem 1rem;
  align-items: center;
  gap: 0.5rem;

  border-radius: 1rem;
  background: #00ec97;

  color: #f4f4f4 !important;
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 700;
  line-height: 120%; /* 28.8px */
  letter-spacing: -0.03rem;

  width: max-content;
  text-decoration: none;

  &:hover {
    text-decoration: none;
    background: #555555;
  }

  @media screen and (max-width: 768px) {
    color: #f4f4f4 !important;
    font-size: 1.125rem;
    font-style: normal;
    font-weight: 700;
    line-height: 120%; /* 24px */
    letter-spacing: -0.4px;

    margin-left: auto;
    margin-right: auto;

    display: flex;
    padding: 14px 16px;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 8px;

    border-radius: 16px;
    background: #00ec97;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;

  padding: 3rem;
  padding-top: 0;

  @media screen and (max-width: 768px) {
    padding: 1.5rem;
    padding-top: 0;
  }
`;

const CardsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1.5rem;

  @media screen and (max-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    /* gap: 2.25rem; */
  }
`;

const Content = (
  <Container>
    <CardsContainer>
      {Cards.map((card) => (
        <SectionCard
          title={card.title}
          description={card.description}
          href={card.href}
          key={Math.random()}
        />
      ))}
    </CardsContainer>
    <CTA href="https://near.org/ecosystem" target="_blank">
      Explore the Open Web on NEAR →
    </CTA>
  </Container>
);

return (
  <Widget
    src="${REPL_DEVHUB}/widget/devhub.components.island.home-section"
    props={{
      title: "/explore",
      titleColor: "#555555",
      description:
        "NEAR Protocol is your fast, low-cost and reliable gateway to the Open Web",
      children: Content,
    }}
  />
);
