const ButtonRoot = styled.button`
  min-height: 42;
  line-height: 1.5;

  &.btn-sm {
    min-height: 32;
    line-height: 1;
  }

  &.btn-lg {
    min-height: 48;
    line-height: 1.7;
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
      "btn shadow d-inline-flex align-items-center gap-2 rounded-pill p-2",
      classNames.root ?? "btn-primary",
    ].join(" ")}
    style={{ width: "fit-content" }}
    {...restProps}
  >
    {classNames.adornment ? (
      <i className={classNames.adornment} style={{ lineHeight: "inherit" }} />
    ) : null}

    <span className={classNames.label} style={{ lineHeight: "inherit" }}>
      {label}
    </span>
  </ButtonRoot>
);

return Button(props);
