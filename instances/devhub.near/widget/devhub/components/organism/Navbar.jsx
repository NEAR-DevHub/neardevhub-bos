const page = props.page;

const [showMenu, setShowMenu] = useState(false);

const { href: linkHref } = VM.require("${REPL_DEVHUB}/widget/core.lib.url");

const { hasModerator } = VM.require(
  "${REPL_DEVHUB}/widget/core.adapter.devhub-contract"
) || { hasModerator: () => {} };

linkHref || (linkHref = () => {});

const Logo = () => {
  const Wrapper = styled.div`
    @media screen and (max-width: 768px) {
      svg {
        width: 90px;
        height: 12px;
        transform: scale(1.5);
        margin-left: 1rem;
      }
    }
  `;

  return (
    <Wrapper>
      <Link
        to={linkHref({
          widgetSrc: "${REPL_DEVHUB}/widget/app",
          params: { page: "home" },
        })}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="180"
          height="24"
          viewBox="0 0 180 24"
          fill="none"
        >
          <g clip-path="url(#clip0_530_29)">
            <path
              d="M8.62185 6.09766C11.8428 6.09766 14.5995 7.77588 14.5995 12.7821V20.8888H10.508V13.1803C10.508 10.7057 9.55041 9.39721 7.49016 9.39721C5.37187 9.39721 4.15313 10.8763 4.15313 13.4079V20.8888H0.0616455V6.26832H3.63081L4.00804 8.08877C4.96563 6.95099 6.32945 6.09766 8.62185 6.09766ZM23.911 21.0594C18.9489 21.0594 15.9601 18.1297 15.9601 13.607C15.9601 9.05588 19.007 6.09766 23.6208 6.09766C28.0895 6.09766 31.1073 8.82832 31.1654 13.1234C31.1654 13.5501 31.1364 14.0337 31.0493 14.4888H20.2257V14.6879C20.3128 16.7643 21.6766 18.0159 23.7369 18.0159C25.3909 18.0159 26.5516 17.3048 26.8998 15.9394H30.9332C30.4689 18.7839 27.8864 21.0594 23.911 21.0594ZM20.3128 11.8719H27.0449C26.7547 10.0799 25.5069 9.08432 23.6498 9.08432C21.8797 9.08432 20.5449 10.1368 20.3128 11.8719ZM47.0396 17.5039H47.5039V20.8888H45.4146C43.2963 20.8888 42.6289 19.8932 42.6579 18.4994C41.6133 20.1208 40.1044 21.0594 37.783 21.0594C34.562 21.0594 32.2406 19.5519 32.2406 16.7643C32.2406 13.6639 34.6201 11.9003 39.0888 11.9003H42.0486V11.1892C42.0486 9.88077 41.091 9.02743 39.3789 9.02743C37.783 9.02743 36.7093 9.73854 36.5352 10.8194H32.5888C32.879 7.97499 35.5486 6.09766 39.495 6.09766C43.6736 6.09766 46.082 7.9181 46.082 11.4168V16.5937C46.082 17.3617 46.4012 17.5039 47.0396 17.5039ZM42.0486 14.8585V14.5741H39.0598C37.3477 14.5741 36.3611 15.2568 36.3611 16.4799C36.3611 17.5039 37.2026 18.1581 38.5665 18.1581C40.7138 18.1581 42.0196 16.8497 42.0486 14.8585ZM56.8924 6.26832H57.5889V9.90921H55.9639C53.5264 9.90921 52.5978 11.5021 52.5978 13.7208V20.8888H48.5064V6.26832H52.2206L52.5978 8.45854C53.4103 7.1501 54.571 6.26832 56.8924 6.26832Z"
              fill="#00EC97"
            />
            <path
              d="M60.7221 23.961H59.2422L67.4542 0.124512H68.9341L60.7221 23.961ZM82.8081 8.08896V0.977843H86.8996V20.889H83.3304L82.9242 18.8694C81.9376 20.121 80.4867 21.0596 78.3394 21.0596C74.335 21.0596 71.4042 18.1867 71.4042 13.5503C71.4042 9.02762 74.335 6.09785 78.3104 6.09785C80.3706 6.09785 81.8505 6.89429 82.8081 8.08896ZM79.239 17.7885C81.4733 17.7885 82.8662 16.0818 82.8662 13.6072C82.8662 11.1041 81.4733 9.36896 79.239 9.36896C77.0046 9.36896 75.5827 11.0756 75.5827 13.5787C75.5827 16.0818 77.0046 17.7885 79.239 17.7885ZM96.2521 21.0596C91.2901 21.0596 88.3013 18.1298 88.3013 13.6072C88.3013 9.05607 91.3482 6.09785 95.962 6.09785C100.431 6.09785 103.449 8.82851 103.507 13.1236C103.507 13.5503 103.478 14.0338 103.39 14.489H92.5669V14.6881C92.6539 16.7645 94.0178 18.0161 96.078 18.0161C97.732 18.0161 98.8927 17.305 99.2409 15.9396H103.274C102.81 18.7841 100.228 21.0596 96.2521 21.0596ZM92.6539 11.8721H99.386C99.0959 10.0801 97.8481 9.08451 95.991 9.08451C94.2209 9.08451 92.8861 10.137 92.6539 11.8721ZM108.081 20.889L102.713 6.26851H107.094L110.692 16.793L114.233 6.26851H118.527L113.159 20.889H108.081ZM120.906 23.961H119.427L127.639 0.124512H129.118L120.906 23.961ZM140.671 6.09785C143.979 6.09785 146.707 7.83296 146.707 12.7823V20.889H142.615V13.1236C142.615 10.7343 141.629 9.3974 139.597 9.3974C137.508 9.3974 136.26 10.8765 136.26 13.3796V20.889H132.169V0.977843H136.26V8.06051C137.218 6.92273 138.553 6.09785 140.671 6.09785ZM158.367 13.5787V6.26851H162.459V20.889H158.832L158.454 19.1254C157.497 20.2632 156.191 21.0596 154.073 21.0596C150.997 21.0596 148.153 19.5521 148.153 14.3752V6.26851H152.245V13.8347C152.245 16.4516 153.115 17.7316 155.146 17.7316C157.178 17.7316 158.367 16.281 158.367 13.5787ZM173.022 6.09785C177.027 6.09785 179.928 8.91385 179.928 13.5503C179.928 18.073 177.027 21.0596 172.993 21.0596C170.846 21.0596 169.366 20.1494 168.408 18.8978L168.002 20.889H164.433V0.977843H168.524V8.1174C169.511 6.95118 170.962 6.09785 173.022 6.09785ZM172.094 17.7885C174.328 17.7885 175.779 16.0818 175.779 13.5787C175.779 11.0756 174.328 9.36896 172.094 9.36896C169.859 9.36896 168.466 11.0756 168.466 13.5503C168.466 16.0534 169.859 17.7885 172.094 17.7885Z"
              fill="#151515"
            />
          </g>
          <defs>
            <clipPath id="clip0_530_29">
              <rect width="180" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </Link>
    </Wrapper>
  );
};

const ProfileIcon = () => {
  const Wrapper = styled.svg`
    padding: 0.25rem;
    @media screen and (max-width: 768px) {
      display: none;
    }
  `;
  return (
    <Link
      to={linkHref({
        widgetSrc: "${REPL_DEVHUB}/widget/app",
        params: { page: "profile", accountId: context.accountId },
      })}
    >
      <Widget
        src="${REPL_DEVHUB}/widget/devhub.components.molecule.ProfileCard"
        props={{ iconOnly: true, accountId: context.accountId || null }}
      />
    </Link>
  );
};

const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    style={{ height: 20, width: 20 }}
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M2 12.2986H14V13.3732H2V12.2986ZM2 9.07471H14V10.1493H2V9.07471ZM2 5.85083H14V6.92546H2V5.85083ZM2 2.62695H14V3.70158H2V2.62695Z"
      fill="#818181"
    />
  </svg>
);

const Navbar = styled.div`
  padding: 1.5rem 0rem;

  background: #f4f4f4;

  @media screen and (max-width: 768px) {
    padding: 1.875rem 1.375rem;
  }
`;

const LinksContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1.5rem;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const MobileMenu = styled.button`
  all: unset;
  display: none;

  @media screen and (max-width: 768px) {
    display: block;
  }
`;

let links = [
  {
    title: "/communities",
    href: "communities",
    links: [],
  },
  {
    title: "/proposals",
    href: "proposals",
    links: [],
  },
  {
    title: "/about",
    links: [
      { title: "mission", href: "about" },
      { title: "blog", href: "blogv2" },
      { title: "newsletter", href: "https://newsletter.neardevhub.org" },
      {
        title: "calendar",
        href: "https://calendar.google.com/calendar/embed?height=600&wkst=2&bgcolor=%23ffffff&ctz=UTC&title&showNav=1&showDate=1&mode=AGENDA&showPrint=0&src=Y19mNTRlZDM3ZmQ5MjMyN2FjZGM3ZTQzNDNmZTQwNzIyYWU1Nzk3YjZjODI5MjliYTkzZTlmM2E4OWM2OTY1N2FiQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20&color=%23616161",
      },
      {
        title: "brand kit",
        href: "https://drive.google.com/drive/folders/1C0GMmGq3MzbVPpxvf9807IU-7kpc2_v5?usp=sharing",
      },
    ],
  },
];

const isDevHubModerator = hasModerator({
  account_id: context.accountId,
});

if (isDevHubModerator) {
  links = [
    {
      title: "/admin",
      href: "admin",
      links: [],
    },
    ...links,
  ];
}

const MobileNav = styled.div`
  display: none;

  @media screen and (max-width: 768px) {
    display: flex;
  }

  position: absolute;
  top: 0;
  right: 0;

  width: 207px;

  padding: 24px 36px 36px 16px;
  flex-direction: column;
  align-items: flex-end;
  gap: 2.5rem;
  flex-shrink: 0;

  border-radius: 0px 0px 0px 16px;
  background: rgba(41, 41, 41, 0.6);
  backdrop-filter: blur(5px);

  z-index: 50;
`;

const MobileLink = styled.a`
  color: #f4f4f4 !important;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 100% */
  margin-bottom: 1rem;

  &.active {
    color: #00ec97 !important;
  }

  &:hover {
    text-decoration: none;
    color: #00ec97 !important;
  }
`;

return (
  <Navbar className="position-relative">
    <div className="d-flex justify-content-between align-items-center">
      <Logo />
      <div className="d-flex gap-3 align-items-center">
        {isDevHubModerator ? (
          <Widget
            src="${REPL_DEVHUB}/widget/devhub.components.island.contract-balance"
            props={{
              accountId: "${REPL_DEVHUB}",
              dark: false,
            }}
          />
        ) : null}
        <LinksContainer>
          {links.map((link) => (
            <Widget
              src="${REPL_DEVHUB}/widget/devhub.components.molecule.NavbarDropdown"
              props={{
                title: link.title,
                href: link.href,
                links: link.links,
                page: page,
              }}
            />
          ))}
        </LinksContainer>
        {context.accountId && <ProfileIcon />}
        <MobileMenu onClick={() => setShowMenu(!showMenu)}>
          <MenuIcon />
        </MobileMenu>
      </div>
      {showMenu && (
        <MobileNav>
          <div
            onClick={() => setShowMenu(!showMenu)}
            style={{ cursor: "pointer" }}
          >
            <i
              className="bi bi-x"
              style={{ fontSize: 20, color: "#F4F4F4" }}
            ></i>
          </div>
          <div className="d-flex flex-column gap-2">
            {links.map((link, idx) =>
              link.href ? (
                <MobileLink
                  key={`mobile-link-${idx}`}
                  className={link.href === props.page && "active"}
                  href={`/${REPL_DEVHUB}/widget/app?page=${link.href}`}
                >
                  {link.title}
                </MobileLink>
              ) : (
                link.links.map((it, idx) =>
                  it.href.startsWith("http://") ||
                  it.href.startsWith("https://") ? (
                    <MobileLink
                      key={`nested-link-${idx}`}
                      className={link.href === props.page && "active"}
                      href={it.href}
                      target="no_blank"
                    >
                      /{it.title}
                    </MobileLink>
                  ) : (
                    <MobileLink
                      key={`nested-link-${idx}`}
                      className={link.href === props.page && "active"}
                      href={`/${REPL_DEVHUB}/widget/app?page=${it.href}`}
                    >
                      /{it.title}
                    </MobileLink>
                  )
                )
              )
            )}
          </div>
        </MobileNav>
      )}
    </div>
    <div
      className="text-white text-center mt-2 rounded-3 px-4 py-2 fw-bold"
      style={{
        background: "linear-gradient(to right, #00140D, #167553, #167553)",
      }}
    >
      ⚠️ This page is now archived! Visit{" "}
      <a
        className="text-decoration-underline"
        href="https://nearn.io/devhub/"
        target="_blank"
      >
        DevHub
      </a>{" "}
      on NEARN to see the latest opportunities.
    </div>
  </Navbar>
);
