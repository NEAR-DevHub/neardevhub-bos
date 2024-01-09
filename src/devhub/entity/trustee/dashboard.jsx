const { normalize } = VM.require("${REPL_DEVHUB}/widget/core.lib.stringUtils");
const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url");

href || (href = () => {});

normalize || (normalize = () => {});

const { tab, ...passProps } = props;

const NavUnderline = styled.ul`
  cursor: pointer;

  a {
    text-decoration: none;
    color: #939597;
  }

  a.active {
    font-weight: bolder;
    color: #151515;
    border-bottom: 3px solid black;
  }

  a:hover {
    color: #151515;
  }
`;

const tabs = [
  {
    title: "Need Approvals",
    view: "approvals",
    props: {},
  },
  {
    title: "Payment History",
    view: "history",
    props: {},
  },
  {
    title: "Treasury",
    view: "treasury",
    props: {},
  },
];

if (!tab) {
  tab = normalize("Need Approvals");
}

let currentTab = tabs.find((it) => normalize(it.title) === tab);

return (
  <div>
    <NavUnderline className="nav gap-4 my-4">
      {tabs.map(
        ({ title }) =>
          title && (
            <li className="nav-item" key={title}>
              <Link
                to={href({
                  widgetSrc: `${REPL_DEVHUB}/widget/app`,
                  params: {
                    page: "devDaoDashboard",
                    accountType: "trustees",
                    tab: normalize(title),
                  },
                })}
                className={[
                  "d-inline-flex gap-2",
                  tab === normalize(title) ? "nav-link active" : "nav-link",
                ].join(" ")}
              >
                <span>{title}</span>
              </Link>
            </li>
          )
      )}
    </NavUnderline>
    {currentTab && (
      <div className="w-100 h-100 mt-4" key={currentTab.title}>
        <Widget
          src={`${REPL_DEVHUB}/widget/devhub.entity.trustee.${currentTab.view}`}
          props={currentTab.props}
        />
      </div>
    )}
  </div>
);
