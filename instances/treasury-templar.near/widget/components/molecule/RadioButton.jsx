const RadioButton = ({ value, isChecked, label, onClick, disabled }) => {
  const [checked, setChecked] = useState(isChecked);

  useEffect(() => {
    if (isChecked !== checked) {
      setChecked(isChecked);
    }
  }, [isChecked]);

  useEffect(() => {
    onClick(checked);
  }, [checked]);

  return (
    <div className="d-flex gap-2 align-items-center">
      <input
        className="form-check-input"
        type="radio"
        disabled={disabled}
        value={value}
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
      <label className="form-check-label text-sm">{label}</label>
    </div>
  );
};

return RadioButton(props);
