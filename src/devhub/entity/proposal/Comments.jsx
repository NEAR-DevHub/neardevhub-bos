const socialComments = Social.index("comment", props.item);

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

const Comment = ({ commentItem }) => {
  const { accountId, blockHeight } = commentItem;
  const item = {
    type: "social",
    path: `${accountId}/post/comment`,
    blockHeight,
  };
  const content = JSON.parse(
    Social.get(`${accountId}/post/comment`, blockHeight) ?? "null"
  );

  const link = `/mob.near/widget/MainPage.N.Post.Page?accountId=${accountId}&blockHeight=${blockHeight}`;
  return (
    <div className="d-flex gap-2 flex-1">
      <Widget
        src={"${REPL_DEVHUB}/widget/devhub.entity.proposal.Profile"}
        props={{
          accountId: accountId,
        }}
      />
      <CommentContainer className="rounded-2 flex-1">
        <Header className="d-flex gap-3 align-items-center p-2 px-3">
          <div>
            {accountId} commented
            <Widget
              src="${REPL_NEAR}/widget/TimeAgo"
              props={{
                blockHeight: blockHeight,
              }}
            />
          </div>
          <div className="menu">
            <Widget
              src="${REPL_NEAR}/widget/Posts.Menu"
              props={{
                accountId: accountId,
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
        <div className="p-2 px-3">
          <Widget
            src={
              "${REPL_DEVHUB}/widget/devhub.components.molecule.MarkdownViewer"
            }
            props={{
              text: content.text,
            }}
          />

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
                url: link,
              }}
            />
            <Widget
              src="${REPL_NEAR}/widget/ShareButton"
              props={{
                postType: "post",
                url: link,
              }}
            />
          </div>
        </div>
      </CommentContainer>
    </div>
  );
};

if (socialComments.length) {
  return (
    <div className="d-flex flex-column gap-2">
      {socialComments.map((i) => (
        <Comment commentItem={i} />
      ))}
    </div>
  );
}
