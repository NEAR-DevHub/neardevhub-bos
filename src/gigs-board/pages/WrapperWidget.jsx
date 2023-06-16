/* INCLUDE: "common.jsx" */
const nearDevGovGigsContractAccountId =
  props.nearDevGovGigsContractAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];

const nearDevGovGigsWidgetsAccountId =
  props.nearDevGovGigsWidgetsAccountId ||
  // (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];
  (context.widgetSrc ?? "jgdev.near").split("/", 1)[0];

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

const WrapperWidget = ({ children, id, storageType }) => {
  // This function handles the state change for the children widgets
  const handleStateChange = (key, value) => {
    // Use the unique identifier to create a unique storage key
    const storageKey = `${id}_${key}`;

    if (storageType === "local") {
      // Update the local storage with the new state
      Storage.set(storageKey, JSON.stringify(value));
    } else if (storageType === "sync") {
      // Update the sync storage with the new state
      // Replace this with the appropriate API call for your sync storage
      Storage.set(storageKey, JSON.stringify(value));
    }

    // Update component state
    State.update({ [storageKey]: value });
  };

  // This function initializes the state of the children widgets
  const initState = (key, defaultValue) => {
    // Use the unique identifier to create a unique storage key
    const storageKey = `${id}_${key}`;

    let storedValue;
    if (storageType === "local") {
      storedValue = Storage.get(storageKey);
    }

    if (storedValue) {
      return JSON.parse(storedValue);
    }

    return defaultValue;
  };

  // Render the children widgets and pass the state management functions as props
  return children.map((child) =>
    Widget({ src: child, props: { handleStateChange, initState } })
  );
};
