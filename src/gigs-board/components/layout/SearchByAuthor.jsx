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
      src={`${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.${widgetName}`}
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
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  return `/#/${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.pages.${widgetName}${
    linkPropsQuery ? "?" : ""
  }${linkPropsQuery}`;
}
/* END_INCLUDE: "common.jsx" */

const onSearchAuthor = props.onSearchAuthor;
const selectedAuthors = props.authorQuery?.author
  ? [{ name: props.authorQuery.author }]
  : [];

const authors = Near.view(nearDevGovGigsContractAccountId, "get_all_authors");
if (!authors) {
  return <div>Loading ...</div>;
}
const wrappedAuthors = authors.map((author) => ({ name: author }));

const onChangeAuthor = (selectedAuthors) => {
  onSearchAuthor(selectedAuthors[0]?.name);
};

function customMenu(results, menuProps, menuState) {
  // return (

  // );

  return (
    <div
      // style={{ width: "10rem", maxHeight: "10rem", overflowY: "scroll" }}
      // id="basic-typeahead-single"
      aria-label="menu-options"
      class="rbt-menu dropdown-menu show"
      role="listbox"
      // style="position: absolute; inset: 0px auto auto 0px; display: block; max-height: 300px; overflow: auto; transform: translate3d(0px, 38px, 0px); width: 160px;"
      data-popper-reference-hidden="false"
      data-popper-escaped="false"
      data-popper-placement="bottom-start"
    >
      {results.map((result, idx) => (
        <a
          aria-label={result.name}
          aria-selected="false"
          id={`basic-typeahead-single-item-${idx}`}
          role="option"
          class="dropdown-item"
          href="#"
        >
          {result.name}
        </a>
      ))}
    </div>
  );
}

const aaaa = (
  <div id="basic-typeahead-single" style={{ width: "10rem", border }}></div>
);
return (
  <>
    <Typeahead
      clearButton
      className="bg-light border border-light"
      style={{ width: "10rem" }}
      id="basic-typeahead-single"
      labelKey="name"
      onChange={onChangeAuthor}
      options={wrappedAuthors}
      placeholder="Search by author"
      // renderMenu={customMenu}
      selected={selectedAuthors}
    />
  </>
);
