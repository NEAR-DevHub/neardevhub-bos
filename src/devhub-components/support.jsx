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
      href: "#",
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
      href: "#",
      title: "Book a meeting ↗",
    },
  },
  {
    heading: <>Get Funding</>,
    description:
      "Explore funding opportunities from DevHub to fuel your vision",
    cta: {
      href: "#",
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
    color: #00ec97;
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
`;

const ItemsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
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

return widget("section.home-section", {
  title: "/get support",
  children: Content,
  background: true,
});
