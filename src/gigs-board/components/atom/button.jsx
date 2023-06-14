const ButtonRoot = styled.button`
  min-height: 42;
  line-height: 1.5;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
  transition: box-shadow 0.6s;

  &:hover {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  }

  &.btn-sm {
    min-height: 32;
    line-height: 1;
  }

  &.btn-lg {
    min-height: 48;
    line-height: 1.7;
  }

  &.btn-primary {
    --bs-btn-color: #fff;
    --bs-btn-bg: #087990;
    --bs-btn-border-color: #087990;
    --bs-btn-hover-color: #fff;
    --bs-btn-hover-bg: #087990;
    --bs-btn-hover-border-color: #087990;
    --bs-btn-focus-shadow-rgb: 61, 138, 253;
    --bs-btn-active-color: #fff;
    --bs-btn-active-bg: #087990;
    --bs-btn-active-border-color: #087990;
    --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
    --bs-btn-disabled-color: #fff;
    --bs-btn-disabled-bg: #087990;
    --bs-btn-disabled-border-color: #087990;
  }

  & *:first-child {
    padding-left: 4px;
  }

  & *:last-child {
    padding-right: 4px;
  }
`;

const Button = ({ classNames, label, ...restProps }) => (
  <ButtonRoot
    className={[
      "btn d-inline-flex align-items-center gap-2 rounded-pill p-2",
      classNames.root ?? "btn-primary",
    ].join(" ")}
    style={{ width: "fit-content" }}
    {...restProps}
  >
    {classNames.adornment ? (
      <i className={classNames.adornment} style={{ lineHeight: 1 }} />
    ) : null}

    <span className={classNames.label} style={{ lineHeight: "inherit" }}>
      {label}
    </span>
  </ButtonRoot>
);

return Button(props);
