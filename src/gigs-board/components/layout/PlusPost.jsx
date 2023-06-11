/* INCLUDE "common.jsx" */
const nearDevGovGigsContractAccountId =
  props.nearDevGovGigsContractAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];
const nearDevGovGigsWidgetsAccountId =
  props.nearDevGovGigsWidgetsAccountId ||
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
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  return `/#/${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.pages.${widgetName}${
    linkPropsQuery ? "?" : ""
  }${linkPropsQuery}`;
}
/* END_INCLUDE: "common.jsx" */
/* INCLUDE "communities.jsx" */
/* END_INCLUDE: "communities.jsx" */

State.init({ showModal: false, modalContent: "" });

const handleToggleModal = () => {
  State.update({ showModal: !state.showModal });
};

return (
  <>
    {state.showModal && ( // This conditionally renders the div containing the Widget
      <div
        style={{
          position: "fixed",
          backgroundColor: "transparent",
          padding: "5px",
          zIndex: "1000",
          maxHeight: "calc(100vh - 40px)",
          overflow: "auto",
          width: "700px",
        }}
      >
        <Widget
          src={`${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.components.layout.Controls`}
          props={{
            metadata: metadata,
            accountId: accountId,
            widgetName: widgetName,
          }}
        />
      </div>
    )}
    <button
      style={{
        fontSize: "1em",
        backgroundColor: "#008080",
        color: "white",
        borderRadius: "4px",
        float: "right",
        padding: "10px",
        height: "45px",
        width: "95px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginRight: "10px",
      }}
      class="btn"
      onClick={handleToggleModal} // Button click toggles the modal visibility
    >
      <span
        style={{
          backgroundColor: "white",
          color: "#008080",
          borderRadius: "50%",
          padding: "5px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginRight: "5px",
          height: "15px",
          width: "15px",
        }}
      >
        <span style={{ lineHeight: "0", marginTop: "3px" }}>
          {state.showModal ? "-" : "+"}
        </span>
      </span>
      <span
        style={{ alignSelf: "center", marginTop: "4px", marginLeft: "5px" }}
      >
        {state.showModal ? " Close" : " Post"}
      </span>
    </button>
  </>
);
