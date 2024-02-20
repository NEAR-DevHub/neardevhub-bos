const item = props.item;
const socialComments = Social.index("comment", item);

const CommentContainer = styled.div`
  border: 1px solid lightgrey;
`;

const Header = styled.div`
  position: relative;
  background-color: #f4f4f4;
  height: 50px;

  .menu {
    position: absolute;
    right: 10px;
    top: 4px;
    font-size: 30px;
  }
`;

const Comment = ({ blockHeight, accountId }) => {
  const commentQuery = `
query CommentQuery {
  dataplatform_near_social_feed_comments(
    where: {_and: {account_id: {_eq: "${accountId}"}, block_height: {_eq: ${blockHeight}}}}
  ) {
    content
    block_timestamp
    receipt_id
    post {
      account_id
      block_height
    }
  }
}
`;

  function fetchGraphQL(operationsDoc, operationName, variables) {
    return asyncFetch(`${GRAPHQL_ENDPOINT}/v1/graphql`, {
      method: "POST",
      headers: { "x-hasura-role": "dataplatform_near" },
      body: JSON.stringify({
        query: operationsDoc,
        variables: variables,
        operationName: operationName,
      }),
    });
  }
  function postAsItem(post) {
    return {
      type: "social",
      path: `${post.account_id}/post/main`,
      blockHeight: post.block_height,
    };
  }

  fetchGraphQL(commentQuery, "CommentQuery", {}).then((result) => {
    console.log(result);
    if (result.status === 200) {
      if (result.body.data) {
        const comments =
          result.body.data.dataplatform_near_social_feed_comments;
        if (comments.length > 0) {
          const comment = comments[0];
          let content = JSON.parse(comment.content);

          content.item = postAsItem(comment.post);
          // console.log
          // State.update({
          //   content: content,
          //   notifyAccountId: comment.post.accountId
          // });
        }
      }
    }
  });

  return (
    <div className="d-flex gap-2 flex-1">
      <Widget
        src={"${REPL_DEVHUB}/widget/devhub.entity.proposal.Profile"}
        props={{
          accountId: editorAccountId,
        }}
      />
      <CommentContainer className="rounded-2 flex-1">
        <Header className="d-flex gap-3 align-items-center p-2 px-3">
          {snapshot.editor_id} commented{" "}
          <Widget
            src="${REPL_NEAR}/widget/TimeAgo"
            props={{
              blockHeight,
              blockTimestamp: snapshot.timestamp,
            }}
          />
          <div className="menu">
            <Widget
              src="${REPL_NEAR}/widget/Posts.Menu"
              props={{
                accountId: editorAccountId,
                blockHeight: blockHeight,
                parentFunctions: {
                  toggleEdit: () => {},
                  optimisticallyHideItem: () => {},
                  resolveHideItem: () => {},
                  cancelHideItem: () => {},
                },
              }}
            />
          </div>
        </Header>
        <div>content</div>
        <div className="d-flex gap-2 align-items-center mt-4">
          <Widget
            src="${REPL_NEAR}/widget/v1.LikeButton"
            props={{
              item,
            }}
          />
          <Widget
            src="${REPL_NEAR}/widget/CommentButton"
            props={{
              item,
              onClick: () => {},
            }}
          />
          <Widget
            src="${REPL_NEAR}/widget/CopyUrlButton"
            props={{
              url: proposalURL,
            }}
          />
          <Widget
            src="${REPL_NEAR}/widget/ShareButton"
            props={{
              postType: "post",
              url: proposalURL,
            }}
          />
        </div>
      </CommentContainer>
    </div>
  );
};

// if (socialComments.length) {
//   return (
//     <div className="d-flex flex-column gap-2">
//       {socialComments.map((i) => (
//         <Comment blockHeight={i.blockHeight} accountId={i.accountId} />
//       ))}
//     </div>
//   );
// }
