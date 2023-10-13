const MarkdownEditor = ({ data, onChange }) => {
  return (
    <Widget
      src={
        context.networkId === "mainnet"
          ? "devhub.efiz.near/widget/SimpleMDE"
          : "efiz.testnet/widget/SimpleMDE"
      }
      props={{
        data,
        onChange,
        toolbar: [
          "heading",
          "bold",
          "italic",
          "quote",
          "code",
          "link",
          "unordered-list",
          "ordered-list",
          "checklist",
          "mention",
        ],
        statusConfig: [],
        spellChecker: false,
      }}
    />
  );
};

return MarkdownEditor(props);
