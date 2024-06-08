const MarkdownEditor = ({ data, onChange, showAutoComplete }) => {
  return (
    <Widget
      src={"devhub.near/widget/devhub.components.molecule.SimpleMDE"}
      props={{
        data,
        onChange,
        showAutoComplete,
      }}
    />
  );
};
return MarkdownEditor(props);
