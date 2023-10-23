const Container = styled.div`
  margin-top: 2.25rem;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

const LinkItem = styled.a`
  color: #00ec97;
  font-size: 1.25rem;
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
  margin-top: 1.5rem;
`;

const SectionPadding = styled.div`
  padding: 3rem;
  padding-top: 0;
`;

const LinksContainer = styled.div`
  width: 30%;
`;

const Content = (
  <SectionPadding>
    <Container>
      {Links.map((it) => (
        <LinksContainer key={Math.random()}>
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
        </LinksContainer>
      ))}
    </Container>
    <CTA href="#">Learn more →</CTA>
  </SectionPadding>
);

return (
  <Widget
    src="${REPL_DEVHUB}/widget/devhub.components.island.home-section"
    props={{
      title: "/contribute",
      description:
        "There are many ways to start your contribution journey. You can:",
      children: Content,
    }}
  />
);
