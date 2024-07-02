const CheckBox = ({ value, isChecked, label, onClick }) => {
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
        class="form-check-input"
        type="checkbox"
        value={value}
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
      <label class="form-check-label text-sm">{label}</label>
    </div>
  );
};

return CheckBox(props);
