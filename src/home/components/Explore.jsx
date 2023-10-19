const Card = styled.div`
  display: flex;
  width: 320px;
  height: 280px;
  padding: 24px;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 24px;

  h3 {
    color: #00ec97;
    text-align: center;
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: 120%; /* 28.8px */
  }

  p {
    color: #555;
    text-align: center;
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    line-height: 120%; /* 24px */
  }

  a {
    color: #00ec97;
    text-align: center;
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: 120%; /* 24px */
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
    href: "#",
  },
  {
    title: "<1s, <1¢",
    description:
      "Fast and cost-efficient transactions. 1s to update values with minimal fees",
    href: "#",
  },
  {
    title: "Awesome DevEx",
    description:
      "NEAR lets developers innovate with familiar tools: TypeScript, Rust, Solidity",
    href: "#",
  },
  {
    title: "Horizontal Scaling",
    description:
      "Nightshade ensures maximum performance thanks to its sharded design",
    href: "#",
  },
];

const CTA = styled.a`
  display: flex;
  padding: 14px 16px;
  align-items: center;
  gap: 8px;

  border-radius: 16px;
  background: #00ec97;

  color: #f4f4f4;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 120%; /* 28.8px */
  letter-spacing: -0.48px;

  width: max-content;
  text-decoration: none;

  &:hover {
    text-decoration: none;
  }
`;

const Content = (
  <div
    style={{ padding: 48, paddingTop: 0 }}
    className="d-flex flex-column gap-5"
  >
    <div className="d-flex justify-content-between gap-4 justify-content-center">
      {Cards.map((card) => (
        <SectionCard
          title={card.title}
          description={card.description}
          href={card.href}
          key={Math.random()}
        />
      ))}
    </div>
    <CTA href="#">Explore the Open Web on NEAR →</CTA>
  </div>
);

return (
  <Widget
    src="devhub.testnet/widget/home.components.Section.HomeSection"
    props={{
      title: "/explore",
      description:
        "NEAR Protocol is your fast, low-cost and reliable gateway to the Open Web",
      children: Content,
    }}
  />
);
