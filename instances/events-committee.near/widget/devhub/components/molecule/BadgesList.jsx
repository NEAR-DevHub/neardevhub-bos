const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url") || (() => {});

const nearDevGovBadgesContractId = "neardevgov.near";

let badges = props.badges;
const mode = props.mode || "normal";

if (!badges) {
  const accountId = props.accountId || context.accountId;
  const ownedBadges = Near.view(
    nearDevGovBadgesContractId,
    "nft_tokens_for_owner",
    {
      account_id: accountId,
    }
  );
  if (!ownedBadges) {
    return <>{mode === "compact" ? "" : "Loading..."}</>;
  }
  badges = ownedBadges;
}

let style;
if (mode === "normal") {
  style = { width: "3em", height: "3em" };
} else if (mode === "compact") {
  style = { width: "1.5em", height: "1.5em" };
}
if (props.style) {
  style = props.style;
}

const renderedBadgesList = badges.map(({ token_id: tokenId, metadata }) => (
  <Link
    to={`/neardevgov.near/widget/BadgeDetails?tokenId=${tokenId}`}
    title={`NEAR DevGov Badge - ${metadata.title}`}
  >
    <Widget
      src="${REPL_MOB}/widget/NftImage"
      props={{
        style,
        nft: {
          tokenMetadata: metadata,
          contractId: nearDevGovBadgesContractId,
        },
        alt: `NEAR DevGov Badge - ${metadata.title}`,
      }}
    />
    {mode === "compact" ? null : metadata.title}
  </Link>
));

if (mode === "compact") {
  return <>{renderedBadgesList}</>;
} else {
  return (
    <ul>
      {renderedBadgesList.map((renderedBadge) => (
        <li style={{ listStyleType: "none" }}>{renderedBadge}</li>
      ))}
    </ul>
  );
}
