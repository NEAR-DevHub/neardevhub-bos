const styles = `
  padding: 0.5rem 1.2rem !important;
  min-height: 42px;
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
    padding: 0.5rem 0.8rem !important;
    min-height: 32px;
    line-height: 1;
  }

  &.btn-lg {
    padding: 1rem 1.5rem !important;
    min-height: 48px;
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

const Button = ({ classNames, icon: iconProps, label, type, ...restProps }) => {
  const ButtonRoot = rootElementByType(type);

  return (
    <ButtonRoot
      className={[
        "btn d-inline-flex align-items-center gap-2 rounded-pill",
        classNames?.root ?? "btn-primary",
      ].join(" ")}
      style={{ width: "fit-content" }}
      {...restProps}
    >
      {iconProps !== null &&
        typeof iconProps === "object" &&
        !Array.isArray(iconProps) && (
          <Widget
            src={"${REPL_DEVHUB}/widget/devhub.components.atom.Icon"}
            props={iconProps}
          />
        )}
      <span className={classNames?.label} style={{ lineHeight: "inherit" }}>
        {label}
      </span>
    </ButtonRoot>
  );
};

return Button(props);
