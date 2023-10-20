/* INCLUDE: "common.jsx" */
const nearDevGovGigsContractAccountId =
  props.nearDevGovGigsContractAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];

const nearDevGovGigsWidgetsAccountId =
  props.nearDevGovGigsWidgetsAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];

function widget(widgetName, widgetProps, key) {
  widgetProps = {
    ...widgetProps,
    nearDevGovGigsContractAccountId: props.nearDevGovGigsContractAccountId,
    nearDevGovGigsWidgetsAccountId: props.nearDevGovGigsWidgetsAccountId,
    referral: props.referral,
  };

  return (
    <Widget
      src={`${nearDevGovGigsWidgetsAccountId}/widget/devhub-components.${widgetName}`}
      props={widgetProps}
      key={key}
    />
  );
}

function href(widgetName, linkProps) {
  linkProps = { ...linkProps };

  if (props.nearDevGovGigsContractAccountId) {
    linkProps.nearDevGovGigsContractAccountId =
      props.nearDevGovGigsContractAccountId;
  }

  if (props.nearDevGovGigsWidgetsAccountId) {
    linkProps.nearDevGovGigsWidgetsAccountId =
      props.nearDevGovGigsWidgetsAccountId;
  }

  if (props.referral) {
    linkProps.referral = props.referral;
  }

  const linkPropsQuery = Object.entries(linkProps)
    .filter(([_key, nullable]) => (nullable ?? null) !== null)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return `/#/${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.pages.${widgetName}${
    linkPropsQuery ? "?" : ""
  }${linkPropsQuery}`;
}
/* END_INCLUDE: "common.jsx" */

const Card = styled.div`
  display: flex;
  width: 20rem;
  height: 17.5rem;
  padding: 1.5rem;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;

  h3 {
    color: #00ec97;
    text-align: center;
    font-size: 1.5rem;
    font-style: normal;
    font-weight: 700;
    line-height: 120%; /* 28.8px */
  }

  p {
    color: #555;
    text-align: center;
    font-size: 1.25rem;
    font-style: normal;
    font-weight: 400;
    line-height: 120%; /* 24px */
  }

  a {
    color: #00ec97;
    text-align: center;
    font-size: 1.25rem;
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
  padding: 0.875rem 1rem;
  align-items: center;
  gap: 0.5rem;

  border-radius: 1rem;
  background: #00ec97;

  color: #f4f4f4;
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 700;
  line-height: 120%; /* 28.8px */
  letter-spacing: -0.03rem;

  width: max-content;
  text-decoration: none;

  &:hover {
    text-decoration: none;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;

  padding: 3rem;
  padding-top: 0;
`;

const CardsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1.5rem;
  justify-content: center;
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
    <CTA href="#">Explore the Open Web on NEAR →</CTA>
  </Container>
);

return widget("section.home-section", {
  title: "/explore",
  description:
    "NEAR Protocol is your fast, low-cost and reliable gateway to the Open Web",
  children: Content,
});
