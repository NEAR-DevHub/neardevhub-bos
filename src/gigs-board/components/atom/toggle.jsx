const ToggleRoot = styled.div`
  justify-content: space-between;
  width: fit-content;
  max-width: 100%;
`;

const ToggleSwitchRoot = styled("Switch.Root")`
  all: unset;
  display: block;
  width: 42px;
  height: 25px;
  background-color: #d1d1d1;
  border-radius: 9999px;
  position: relative;
  box-shadow: 0 2px 10px var(--blackA7);

  &[data-state="checked"] {
    background-color: #00d084;
  }

  &[data-disabled=""] {
    opacity: 0.7;
  }
`;

const ToggleSwitchThumb = styled("Switch.Thumb")`
  all: unset;
  display: block;
  width: 21px;
  height: 21px;
  border-radius: 9999px;
  transition: transform 100ms;
  transform: translateX(2px);
  will-change: transform;

  &[data-state="checked"] {
    transform: translateX(19px);
  }
`;

const ToggleLabel = styled.label`
  white-space: nowrap;
`;

const Toggle = ({
  active,
  className,
  direction,
  disabled,
  key,
  label,
  onSwitch,
  ...rest
}) => (
  <ToggleRoot
    className={[
      "d-flex justify-content-between, align-items-center gap-3",
      direction === "rtl" ? "flex-row-reverse" : "",
      className,
    ].join(" ")}
    {...rest}
  >
    <ToggleLabel htmlFor={`toggle-${key}`}>{label}</ToggleLabel>

    <ToggleSwitchRoot
      checked={active}
      className="shadow-none"
      id={`toggle-${key}`}
      onCheckedChange={disabled ? null : onSwitch}
      title={disabled ? `Permanently ${active ? "enabled" : "disabled"}` : null}
      {...{ disabled }}
    >
      {!disabled && <ToggleSwitchThumb className="bg-light shadow" />}
    </ToggleSwitchRoot>
  </ToggleRoot>
);

return Toggle(props);
