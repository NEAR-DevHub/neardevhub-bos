const MarkdownEditor = ({ data, onChange, showAutoComplete }) => {
  return (
    <Widget
      src={"${alias_REPL_DEVHUB}/widget/devhub.components.molecule.SimpleMDE"}
      props={{
        data,
        onChange,
        showAutoComplete,
      }}
    />
  );
};

return MarkdownEditor(props);
