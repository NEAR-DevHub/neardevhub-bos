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
  <>
    <div class="h5 pb-3">Featured Communities</div>
    <div class="row">
      <div class="col">
        {widget("components.layout.FeaturedCommunity", {
          overviewId: 397,
          eventsId: 401,
          label: "zero-knowledge",
          icon: "https://ipfs.near.social/ipfs/bafkreigthuagbsrl2xbpk5h4bneoteiv4pqa5itokrqrm4wckgasa6d4nm",
          cover:
            "https://ipfs.near.social/ipfs/bafkreifuflol4fgihxcgpxkl56lygpgdisdfbizrjpt4jhir7mvx3ddh4a",
          title: "Zero Knowledge",
          desc: "Building a zero knowledge ecosystem on NEAR.",
        })}
      </div>
      <div class="col">
        {widget("components.layout.FeaturedCommunity", {
          label: "protocol",
          cover:
            "https://ipfs.near.social/ipfs/bafkreifuflol4fgihxcgpxkl56lygpgdisdfbizrjpt4jhir7mvx3ddh4a",
          title: "Protocol",
          desc: "Supporting the ongoing innovation of the NEAR Protocol.",
        })}
      </div>
      <div class="col">
        {widget("components.layout.FeaturedCommunity", {
          label: "tooling",
          cover:
            "https://ipfs.near.social/ipfs/bafkreifuflol4fgihxcgpxkl56lygpgdisdfbizrjpt4jhir7mvx3ddh4a",
          title: "Tooling",
          desc: "Supporting the ongoing innovation of tooling.",
        })}
      </div>
      <div class="col">
        {widget("components.layout.FeaturedCommunity", {
          label: "contract-standards",
          cover:
            "https://ipfs.near.social/ipfs/bafkreifuflol4fgihxcgpxkl56lygpgdisdfbizrjpt4jhir7mvx3ddh4a",
          title: "Contract Standards",
          desc: "Coordinating the contribution to the NEAR dapp standards.",
        })}
      </div>
    </div>
    <div class="h5 pb-3 pt-5">Activity</div>
  </>
);
