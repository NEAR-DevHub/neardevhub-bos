const Container = styled.div`
  margin-top: 36px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

const LinkItem = styled.a`
  color: #00ec97;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 120%; /* 28.8px */

  display: flex;
  align-items: center;
`;

const Links = [
  {
    links: [
      { title: "Propose an idea", href: "#", count: 1 },
      { title: "Build a solution", href: "#", count: 2 },
      { title: "Host an Event", href: "#", count: 3 },
    ],
  },
  {
    links: [
      { title: "Improve NEAR Docs", href: "#", count: 4 },
      { title: "Join forum discussions", href: "#", count: 5 },
    ],
  },
  {
    links: [
      { title: "Become a Mentee/Mentor", href: "#", count: 6 },
      { title: "Join NEAR Campus", href: "#", count: 7 },
    ],
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
  margin-top: 24px;
`;

const Content = (
  <div style={{ padding: 48, paddingTop: 0 }}>
    <Container>
      {Links.map((it) => (
        <div key={Math.random()} style={{ width: "30%" }}>
          <div className="d-flex flex-column gap-2">
            {it.links.map((link) => (
              <LinkItem href={link.href}>
                <span
                  style={{
                    color: "#00ec97",
                    border: "2px #00ec97 solid",
                    fontSize: 12,
                    padding: 4,
                    width: 22,
                    height: 22,
                  }}
                  className="rounded-circle d-flex align-items-center justify-content-center me-1"
                >
                  {link.count}
                </span>{" "}
                {link.title}
              </LinkItem>
            ))}
          </div>
        </div>
      ))}
    </Container>
    <CTA href="#">Learn more →</CTA>
  </div>
);

return (
  <Widget
    src="devhub.testnet/widget/home.components.Section.HomeSection"
    props={{
      title: "/contribute",
      description:
        "There are many ways to start your contribution journey. You can:",
      children: Content,
    }}
  />
);
