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

const access_info =
  Near.view(nearDevGovGigsContractAccountId, "get_access_control_info") ?? null;

if (!access_info) {
  return <div>Loading...</div>;
}

const rules_list = props.rules_list ?? access_info.rules_list;

const permissionExplainer = (permission) => {
  if (permission.startsWith("starts-with:")) {
    let s = permission.substring("starts-with:".length);
    if (s == "") {
      return "Any label";
    } else {
      return `Labels that start with "${s}"`;
    }
  } else {
    return permission;
  }
};

return (
  <div className="card border-secondary" key="labelpermissions">
    <div className="card-header">
      <i class="bi-lock-fill"> </i>
      <small class="text-muted">Restricted Labels</small>
    </div>
    <ul class="list-group list-group-flush">
      {Object.entries(rules_list).map(([pattern, metadata]) => (
        <li class="list-group-item" key={pattern}>
          <span class="badge text-bg-primary" key={`${pattern}-permission`}>
            {permissionExplainer(pattern)}
          </span>{" "}
          {metadata.description}
        </li>
      ))}
    </ul>
  </div>
);
