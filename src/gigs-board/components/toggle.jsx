const ToggleRoot = styled.div`
  width: fit-content !important;
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
`;

const ToggleSwitchThumb = styled("Switch.Thumb")`
  all: unset;
  display: block;
  width: 21px;
  height: 21px;
  border-radius: 9999px;
  box-shadow: 0 2px 2px var(--blackA7);
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

const Toggle = ({ active, className, key, label, onSwitch, ...rest }) => (
  <ToggleRoot
    className={["d-flex align-items-center gap-2", className].join(" ")}
    {...rest}
  >
    <ToggleSwitchRoot
      checked={active}
      id={`toggle-${key}`}
      onCheckedChange={onSwitch}
    >
      <ToggleSwitchThumb className="bg-light" />
    </ToggleSwitchRoot>

    <ToggleLabel className="" htmlFor={`toggle-${key}`}>
      {label}
    </ToggleLabel>
  </ToggleRoot>
);

return Toggle(props);
