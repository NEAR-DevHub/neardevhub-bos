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
    .filter(([_key, nullable]) => (nullable ?? null) !== null)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return `/#/${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.pages.${widgetName}${
    linkPropsQuery ? "?" : ""
  }${linkPropsQuery}`;
}
/* END_INCLUDE: "common.jsx" */

State.init({
  tag: props.tag,
});

const updateInput = (term) => {
  State.update({
    term,
  });
};

const buttonStyle = {
  backgroundColor: "#0C7283",
  color: "#f3f3f3",
};

return (
  <>
    <div className="d-flex flex-row gap-4">
      <div className="d-flex flex-row position-relative w-25">
        <div className="position-absolute d-flex ps-3 flex-column h-100 justify-center">
          <i class="bi bi-search m-auto"></i>
        </div>
        <input
          type="search"
          className="ps-5 form-control border border-0 bg-light"
          value={state.term ?? ""}
          onChange={(e) => updateInput(e.target.value)}
          placeholder={props.placeholder ?? `Search by content`}
        />
      </div>
      <div class="dropdown">
        <button
          class="btn btn-light dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Sort{props.recency === "all" ? ": All replies" : ": Latest"}
        </button>
        <ul class="dropdown-menu px-2 shadow">
          <li>
            <a
              style={{ borderRadius: "5px" }}
              class="dropdown-item link-underline link-underline-opacity-0"
              href={href("Feed")}
            >
              Latest
            </a>
          </li>
          {/* Sort by hottest is not yet support on indexer side
          <li>
            <a
              style={{ borderRadius: "5px" }}
              class="dropdown-item link-underline link-underline-opacity-0"
              href={href("Feed", { recency: "hot" })}
            >
              Hottest
            </a>
          </li> */}
          <li>
            <a
              style={{ borderRadius: "5px" }}
              class="dropdown-item link-underline link-underline-opacity-0"
              href={href("Feed", { recency: "all" })}
            >
              All replies
            </a>
          </li>
        </ul>
      </div>
      <div class="dropdown">
        {widget("entity.post.AuthorSearch", {
          author: state.author,
          onAuthorSearch: (author) => {
            State.update({ author });
          },
        })}
      </div>
      <div>
        {widget("entity.post.TagSearch", {
          tag: state.tag,
          onTagSearch: (tag) => {
            State.update({ tag });
          },
        })}
      </div>
      <div className="d-flex flex-row-reverse flex-grow-1">
        {props.children}
      </div>
    </div>
    {widget("entity.post.List", {
      author: state.author,
      tag: state.tag,
      term: state.term,
      recency: props.recency,
    })}
  </>
);
