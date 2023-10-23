const [author, setAuthor] = useState(props.author || "");
const [tag, setTag] = useState(props.tag || "");

const onTagSearch = (tag) => {
  setTag(tag);
};

const onAuthorSearch = (author) => {
  setAuthor(author);
};

return (
  <Widget
    src={"${REPL_DEVHUB}/widget/devhub.entity.post.Panel"}
    props={{
      author: author,
      authorQuery: { author },
      children: (
        <Widget
          src={"${REPL_DEVHUB}/widget/devhub.components.molecule.PostControls"}
          props={{ title: "Post", link: "Create" }}
        />
      ),
      onAuthorSearch,
      onTagSearch,
      recency,
      tag: tag,
      tagQuery: { tag },
      transactionHashes: props.transactionHashes,
    }}
  />
);
