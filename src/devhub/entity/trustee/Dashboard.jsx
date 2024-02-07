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

  .nav-item {
    font-size: 15px;
  }
`;

const tabs = [
  {
    title: "Need Approvals",
    view: "Approvals",
    props: {},
  },
  {
    title: "Payment History",
    view: "History",
    props: {},
  },
  {
    title: "Treasury",
    view: "Treasury",
    props: {},
  },
];

function findTab(tabTitle) {
  return tabs.find((it) => normalize(it.title) === tabTitle);
}

const defaultTab = tabs[0].title;
let currentTab = findTab(tab ?? normalize(defaultTab));
// in case tab is not provided, or tab is of modertors page
if (!currentTab) {
  currentTab = findTab(normalize(defaultTab));
}

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
                  normalize(currentTab.title) === normalize(title)
                    ? "nav-link active"
                    : "nav-link",
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
