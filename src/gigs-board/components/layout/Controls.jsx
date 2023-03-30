/* INCLUDE: "common.jsx" */
const nearDevGovGigsContractAccountId =
  props.nearDevGovGigsContractAccountId || "devgovgigs.near".split("/", 1)[0];
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
  return `#/${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.pages.${widgetName}${
    linkPropsQuery ? "?" : ""
  }${linkPropsQuery}`;
}
/* END_INCLUDE: "common.jsx" */

return (
  <div class="card border-secondary mb-2">
    <div class="nav navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <div
          class="navbar-brand"
          style={{ height: "2.5em", width: "2.5em", minWidth: "2.5em" }}
        >
          <Widget
            src="mob.near/widget/ProfileImage"
            props={{
              metadata,
              accountId,
              widgetName,
              style: { height: "2.5em", width: "2.5em", minWidth: "2.5em" },
              className: "me-2",
            }}
          />
        </div>
        <div class="nav navbar-brand h1">Create</div>

        <div class="collapse navbar-collapse" id="navbarText">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a
                class="nav-link active"
                aria-current="page"
                data-bs-toggle="collapse"
                href={`#collapseIdeaEditorNavbar`}
                role="button"
                aria-expanded="false"
                aria-controls={`collapseIdeaEditorNavbar`}
              >
                <i class="bi-lightbulb-fill"> </i>
                Idea
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link active"
                data-bs-toggle="collapse"
                href={`#collapseSubmissionEditorNavbar`}
                role="button"
                aria-expanded="false"
                aria-controls={`collapseSubmissionEditorNavbar`}
              >
                <i class="bi-rocket-fill"> </i>
                Solution
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link active"
                data-bs-toggle="collapse"
                href={`#collapseAttestationEditorNavbar`}
                role="button"
                aria-expanded="false"
                aria-controls={`collapseAttestationEditorNavbar`}
              >
                <i class="bi-check-circle-fill"> </i>
                Attestation
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link active"
                data-bs-toggle="collapse"
                href={`#collapseSponsorshipEditorNavbar`}
                role="button"
                aria-expanded="false"
                aria-controls={`collapseSponsorshipEditorNavbar`}
              >
                <i class="bi-cash-coin"> </i>
                Sponsorship
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="row" id={`accordionNavbar`}>
      <div
        class="collapse"
        id={`collapseCommentEditorNavbar`}
        data-bs-parent={`#accordionNavbar`}
      >
        {widget("components.posts.PostEditor", {
          postType: "Comment",
          parentId: null,
          labels: props.labels,
        })}
      </div>
      <div
        class="collapse"
        id={`collapseIdeaEditorNavbar`}
        data-bs-parent={`#accordionNavbar`}
      >
        {widget("components.posts.PostEditor", {
          postType: "Idea",
          parentId: null,
          labels: props.labels,
        })}
      </div>
      <div
        class="collapse"
        id={`collapseSubmissionEditorNavbar`}
        data-bs-parent={`#accordionNavbar`}
      >
        {widget("components.posts.PostEditor", {
          postType: "Submission",
          parentId: null,
          labels: props.labels,
        })}
      </div>
      <div
        class="collapse"
        id={`collapseAttestationEditorNavbar`}
        data-bs-parent={`#accordionNavbar`}
      >
        {widget("components.posts.PostEditor", {
          postType: "Attestation",
          parentId: null,
          labels: props.labels,
        })}
      </div>
      <div
        class="collapse"
        id={`collapseSponsorshipEditorNavbar`}
        data-bs-parent={`#accordionNavbar`}
      >
        {widget("components.posts.PostEditor", {
          postType: "Sponsorship",
          parentId: null,
          labels: props.labels,
        })}
      </div>
    </div>
  </div>
);
