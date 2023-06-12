const ButtonRoot = styled.button`
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
      <i
        className={[classNames.adornment].join(" ")}
        style={{ lineHeight: 1 }}
      />
    ) : null}

    <span className={[classNames.label].join(" ")} style={{ lineHeight: 1 }}>
      {label}
    </span>
  </ButtonRoot>
);

return Button(props);
