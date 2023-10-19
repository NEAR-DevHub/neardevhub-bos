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
  width: 300px;
  height: 300px;
  padding: 36px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;

  border-radius: 360px;
  border: 1px solid #00ec97;
  background: #f4f4f4;

  h3 {
    color: #101820;
    text-align: center;
    font-size: 28px;
    font-style: normal;
    font-weight: 700;
    line-height: 100%; /* 36px */
  }

  p {
    color: #101820;
    text-align: center;
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: 120%; /* 28.8px */
    letter-spacing: -0.72px;
  }

  a {
    color: #00ec97;
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: 120%; /* 28.8px */
  }
`;

const Content = (
  <div style={{ padding: 48, paddingTop: 0, marginTop: 24 }}>
    <div className="d-flex flex-row justify-content-between align-items-center w-100">
      {Items.map((it) => (
        <Circle key={Math.random()}>
          <h3>{it.heading}</h3>
          <p>{it.description}</p>
          <a href={it.cta.href}>{it.cta.title}</a>
        </Circle>
      ))}
    </div>
  </div>
);

return (
  <Widget
    src="devhub.testnet/widget/home.components.Section.HomeSection"
    props={{
      title: "/get support",
      children: Content,
      background: true,
    }}
  />
);
