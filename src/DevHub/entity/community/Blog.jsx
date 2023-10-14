
// State.init({
//   initial: { author, tag },
//   author,
//   tag,
// });

const [author, setAuthor] = useState(props.author || "");
const [tag, setTag] = useState(props.tag || "");

// // When rerendered with different props, State will be preserved, so we need to update the state when we detect that the props have changed.
// if (tag !== state.initial.tag || author !== state.initial.author) {
//   State.update((lastKnownState) => ({
//     ...lastKnownState,
//     initial: { author, tag },
//     author,
//     tag,
//   }));
// }

const onTagSearch = (tag) => {
  setTag(tag);
};

const onAuthorSearch = (author) => {
  setAuthor(author);
};

return (
  <Widget
    src={`${nearDevGovGigsWidgetsAccountId}/widget/DevHub.entity.post.Panel`}
    props={{
      author: author,
      authorQuery: { author },
      children: (
        <Widget
          src={`${nearDevGovGigsWidgetsAccountId}/widget/DevHub.components.molecule.PostControls`}
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
