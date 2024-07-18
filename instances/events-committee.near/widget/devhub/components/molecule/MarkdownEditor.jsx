const MarkdownEditor = ({ data, onChange, showAutoComplete }) => {
  return (
    <Widget
      src={"${REPL_EVENTS}/widget/devhub.components.molecule.SimpleMDE"}
      props={{
        data,
        onChange,
        showAutoComplete,
      }}
    />
  );
};

return MarkdownEditor(props);
