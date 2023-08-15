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
/* INCLUDE: "core/lib/struct" */
const Struct = {
  deepFieldUpdate: (
    node,
    { input, params, path: [nextNodeKey, ...remainingPath], via: toFieldValue }
  ) => ({
    ...node,

    [nextNodeKey]:
      remainingPath.length > 0
        ? Struct.deepFieldUpdate(
            Struct.typeMatch(node[nextNodeKey]) ||
              Array.isArray(node[nextNodeKey])
              ? node[nextNodeKey]
              : {
                  ...((node[nextNodeKey] ?? null) !== null
                    ? { __archivedLeaf__: node[nextNodeKey] }
                    : {}),
                },

            { input, path: remainingPath, via: toFieldValue }
          )
        : toFieldValue({
            input,
            lastKnownValue: node[nextNodeKey],
            params,
          }),
  }),

  isEqual: (input1, input2) =>
    Struct.typeMatch(input1) && Struct.typeMatch(input2)
      ? JSON.stringify(Struct.toOrdered(input1)) ===
        JSON.stringify(Struct.toOrdered(input2))
      : false,

  toOrdered: (input) =>
    Object.keys(input)
      .sort()
      .reduce((output, key) => ({ ...output, [key]: input[key] }), {}),

  pick: (object, subsetKeys) =>
    Object.fromEntries(
      Object.entries(object ?? {}).filter(([key, _]) =>
        subsetKeys.includes(key)
      )
    ),

  typeMatch: (input) =>
    input !== null && typeof input === "object" && !Array.isArray(input),
};
/* END_INCLUDE: "core/lib/struct" */

const styles = `
  padding: 0.5rem 1.2rem !important;
  min-height: 42;
  line-height: 1.5;
  text-decoration: none !important;

  &:not(.shadow-none) {
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
    transition: box-shadow 0.6s;
  }

  &:hover {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  }

  &.btn-sm {
    padding: 0.5rem 0.75rem !important;
    min-height: 32;
    line-height: 1;
  }

  &.btn-lg {
    padding: 1rem 1.5rem !important;
    min-height: 48;
  }

  &.btn-primary {
    border: none;
    --bs-btn-color: #ffffff;
    --bs-btn-bg: #087990;
    --bs-btn-border-color: #087990;
    --bs-btn-hover-color: #ffffff;
    --bs-btn-hover-bg: #055160;
    --bs-btn-hover-border-color: #055160;
    --bs-btn-focus-shadow-rgb: 49, 132, 253;
    --bs-btn-active-color: #ffffff;
    --bs-btn-active-bg: #055160;
    --bs-btn-active-border-color: #055160;
    --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
    --bs-btn-disabled-color: #ffffff;
    --bs-btn-disabled-bg: #0551604a;
  }

	&.btn-outline-primary {
		--bs-btn-color: #087990;
		--bs-btn-border-color: #087990;
		--bs-btn-hover-color: #ffffff;
		--bs-btn-hover-bg: #087990;
		--bs-btn-hover-border-color: #087990;
		--bs-btn-focus-shadow-rgb: 49, 132, 253;
		--bs-btn-active-color: #ffffff;
		--bs-btn-active-bg: #087990;
		--bs-btn-active-border-color: #087990;
		--bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
		--bs-btn-disabled-border-color: #0551604a;
	}

  &[class*="btn-outline-"] {
    border-width: 2px;
  }

  &.btn-outline-primary {
    --bs-btn-disabled-color: #6c757d8f;
  }

  &.btn-secondary {
    border: none;
  }

  &.btn-outline-secondary {
    --bs-btn-disabled-color: #6c757d8f;
  }

  &.btn-success {
    border: none;
    --bs-btn-disabled-bg: #35482a4a;
  }

  &.btn-outline-success {
    --bs-btn-disabled-color: #6c757d8f;
  }

  &.btn-danger {
    border: none;
  }

  &.btn-outline-danger {
    --bs-btn-disabled-color: #6c757d8f;
  }

  &.btn-warning {
    border: none;
  }

  &.btn-outline-warning {
    --bs-btn-disabled-color: #6c757d8f;
  }

  &.btn-info {
    border: none;
  }

  &.btn-outline-info {
    --bs-btn-disabled-color: #6c757d8f;
  }
`;

const rootElementByType = (type) =>
  type === "link"
    ? styled.a`
        ${styles}
      `
    : styled.button`
        ${styles}
      `;

const Button = ({
  classNames,
  icon: iconProps,
  isHidden,
  label,
  type,
  ...restProps
}) => {
  const ButtonRoot = rootElementByType(type);

  return (
    <ButtonRoot
      className={[
        "btn d-inline-flex align-items-center gap-2 rounded-pill",
        classNames?.root ?? "btn-primary",
        isHidden ?? false ? "d-none" : "",
      ].join(" ")}
      style={{ width: "fit-content" }}
      {...restProps}
    >
      {Struct.typeMatch(iconProps) && widget("components.atom.icon", iconProps)}

      <span className={classNames?.label} style={{ lineHeight: "inherit" }}>
        {label}
      </span>
    </ButtonRoot>
  );
};

return Button(props);
