const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url");

href || (href = () => {});

const Container = styled.div`
  margin-top: 2.25rem;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;

  @media screen and (max-width: 768px) {
    flex-direction: column;
    margin-top: 0;
  }
`;

const LinkItem = styled.a`
  color: #00ec97;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 400;
  line-height: 120%; /* 28.8px */

  display: flex;
  align-items: center;

  &:hover {
    text-decoration: none;
    color: #04146e;
  }
`;

const Links = [
  {
    links: [
      {
        title: "Ideate on Devhub",
        href: "https://www.neardevgov.org/blog/how-to-ideate-on-dev-hub",
        count: 1,
      },
      {
        title: "Post a Proposal",
        href: "https://www.neardevgov.org/blog/how-to-post-proposals-on-devhub",
        count: 4,
      },
      {
        title: "Host an Event",
        href: "https://near.social/devgovgigs.near/widget/app?page=community&handle=hacks&tab=Wiki%202",
        count: 7,
      },
    ],
  },
  {
    links: [
      {
        title: "Improve NEAR Docs",
        href: "https://github.com/near/docs",
        count: 2,
      },
      {
        title: "Join the Fellowship",
        href: "https://near.social/devgovgigs.near/widget/app?page=community&handle=fellowship&tab=Wiki%201",
        count: 5,
      },
    ],
  },
  {
    links: [
      {
        title: "Join NEAR Campus",
        href: "https://near.social/devgovgigs.near/widget/app?page=community&handle=near-campus",
        count: 3,
      },
      {
        title: "Dive into Hackbox",
        href: "https://near.social/hackbox.near/widget/home",
        count: 6,
      },
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

  color: #f4f4f4 !important;
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 700;
  line-height: 120%; /* 28.8px */
  letter-spacing: -0.03rem;

  width: max-content;
  margin-top: 1.5rem;

  &:hover {
    background: #04a46e;
    text-decoration: none !important;
  }

  @media screen and (max-width: 768px) {
    color: #f4f4f4 !important;
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: 120%; /* 24px */

    display: flex;
    padding: 14px 16px;
    align-items: center;
    gap: 8px;

    border-radius: 16px;
    background: #04a46e;

    &:hover {
      //background: #04A46E;
      text-decoration: none;
    }
  }
`;

const SectionPadding = styled.div`
  padding: 3rem;
  padding-top: 0;

  display: flex;
  flex-direction: column;

  @media screen and (max-width: 768px) {
    padding: 1rem;
    padding-top: 0;
  }
`;

const LinksContainer = styled.div`
  width: 30%;

  @media screen and (max-width: 768px) {
    width: 100%;
    margin-bottom: 1rem;
  }
`;

const Content = (
  <SectionPadding>
    <Container>
      {Links.map((it) => (
        <LinksContainer key={Math.random()}>
          <div className="d-flex flex-column gap-3 gap-md-2">
            {it.links.map((link) => (
              <div className="d-flex flex-row">
                <span
                  style={{
                    color: "#04A46E",
                    border: "2px #04A46E solid",
                    fontSize: 12,
                    padding: 4,
                    width: 22,
                    height: 22,
                  }}
                  className="rounded-circle d-flex align-items-center justify-content-center me-1"
                >
                  {link.count}
                </span>{" "}
                <LinkItem href={link.href} target="no_blank">
                  {link.title}
                </LinkItem>
              </div>
            ))}
          </div>
        </LinksContainer>
      ))}
    </Container>

    <Link
      to={href({
        widgetSrc: "${REPL_DEVHUB}/widget/app",
        params: { page: "contribute" },
      })}
      style={{ textDecoration: "none" }}
    >
      <CTA>Learn more →</CTA>
    </Link>
  </SectionPadding>
);

return (
  <Widget
    src="${REPL_DEVHUB}/widget/devhub.components.island.home-section"
    props={{
      title: "/participate",
      titleColor: "#04A46E",
      description:
        "There are many ways to start your contribution journey. You can:",
      children: Content,
    }}
  />
);
