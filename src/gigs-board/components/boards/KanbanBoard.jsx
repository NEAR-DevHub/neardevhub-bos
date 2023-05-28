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

const WrapperWidget = ({ children, id }) => {
  const storageType = "local"; // Hard-coded storage type

  // This function handles the state change for the children widgets
  const handleStateChange = (key, value) => {
    // Use the unique identifier to create a unique storage key
    const storageKey = `${id}_${key}`;

    console.log(`Setting value for ${storageKey}: `, value); // Console log added here

    // Update the local storage with the new state
    localStorage.setItem(storageKey, JSON.stringify(value));
    console.log(`State saved in local storage for ${storageKey}`); // Console log added here
  };

  // This function initializes the state of the children widgets
  const initState = (key, defaultValue) => {
    // Use the unique identifier to create a unique storage key
    const storageKey = `${id}_${key}`;

    let storedValue = localStorage.getItem(storageKey);
    console.log(
      `Retrieved value from local storage for ${storageKey}: `,
      storedValue
    ); // Console log added here

    if (storedValue) {
      try {
        return JSON.parse(storedValue);
      } catch (e) {
        console.error("Error parsing JSON from storage", e);
      }
    }
    return defaultValue;
  };

  // Render the children widgets and pass the state management functions as props
  return React.Children.map(children, (child) =>
    child && typeof child === "object"
      ? React.cloneElement(child, { handleStateChange, initState })
      : child
  );
};
/* END_INCLUDE: "common.jsx" */

const requiredLabels = props.requiredLabels ?? ["near-social"];
const excludedLabels = props.excludedLabels ?? ["nft"];
const columns = props.columns ?? [
  { label: "widget", title: "Widget" },
  { label: "integration", title: "Integration" },
  { label: "feature-request", title: "Feature Request" },
];

const labelsToIdSet = (labels) => {
  const ids = labels.map(
    (label) =>
      Near.view(nearDevGovGigsContractAccountId, "get_posts_by_label", {
        label,
      }) ?? []
  );
  const idsFlat = ids.flat(1);
  return new Set(idsFlat);
};

const requiredPostsSet = labelsToIdSet(requiredLabels);
const excludedPostsSet = labelsToIdSet(excludedLabels);

const postsPerLabel = columns.map((column) => {
  let allIds = (
    Near.view(nearDevGovGigsContractAccountId, "get_posts_by_label", {
      label: column.label,
    }) ?? []
  ).reverse();
  if (requiredLabels.length > 0) {
    return {
      ...column,
      posts: allIds.filter(
        (i) => requiredPostsSet.has(i) && !excludedPostsSet.has(i)
      ),
    };
  } else {
    // No extra filtering is required.
    return { ...column, posts: allIds };
  }
});

return (
  <div>
    <div class="row mb-2">
      {props.boardId ? (
        <div class="col">
          <small class="text-muted">
            <a
              class="card-link"
              href={href("Boards", { selectedBoardId: props.boardId })}
              role="button"
              target="_blank"
              title="Link to this board"
            >
              <div class="hstack gap-3">
                <div class="bi bi-share"></div>
                <div>Link to this board</div>
              </div>
            </a>
          </small>
        </div>
      ) : null}

      {requiredLabels.length > 0 ? (
        <div class="col">
          <small class="text-muted">
            Required labels:
            {requiredLabels.map((label) => (
              <a href={href("Feed", { label })} key={label}>
                <span class="badge text-bg-primary me-1">{label}</span>
              </a>
            ))}
          </small>
        </div>
      ) : null}
      {excludedLabels.length > 0 ? (
        <div class="col">
          <small class="text-muted">
            Excluded labels:
            {excludedLabels.map((label) => (
              <a href={href("Feed", { label })} key={label}>
                <span class="badge text-bg-primary me-1">{label}</span>
              </a>
            ))}
          </small>
        </div>
      ) : null}
    </div>
    <div class="row">
      {postsPerLabel.map((column) => (
        <div class="col-3" key={column.label}>
          <div class="card">
            <div class="card-body border-secondary">
              <h6 class="card-title">
                {column.title}({column.posts.length})
              </h6>
              {column.posts.map((postId) =>
                widget("components.posts.CompactPost", { id: postId }, postId)
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
