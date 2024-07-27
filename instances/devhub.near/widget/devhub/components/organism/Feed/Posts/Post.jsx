const GRAPHQL_ENDPOINT =
  props.GRAPHQL_ENDPOINT || "https://near-queryapi.api.pagoda.co";
let accountId = props.accountId;
let blockHeight =
  props.blockHeight === "now" ? "now" : parseInt(props.blockHeight);
const verifications = props.verifications;
const blockTimestamp = props.blockTimestamp;
const notifyAccountId = accountId;
let postUrl;

if (props.page) {
  postUrl = `https://${REPL_DEVHUB}.page/${props.page}${
    props.handle ? `/${props.handle}${props.tab ? `/${props.tab}` : ""}` : ""
  }`;
} else {
  postUrl = `https://${REPL_DEVHUB}.page/${REPL_DEVHUB}/widget/devhub.components.organism.Feed.Posts.Post`;
}
postUrl += `?accountId=${accountId}&blockHeight=${blockHeight}`;

const showFlagAccountFeature = props.showFlagAccountFeature;
const profile = props.profile;
let repostedByProfile = null;
let repostedByProfileUrl = null;
const parsedContent = props.content
  ? typeof props.content === "string"
    ? JSON.parse(props.content)
    : props.content
  : undefined;

State.init({
  hasBeenFlaggedOptimistic: false,
  hasBeenFlagged: false,
  showToast: false,
  flaggedMessage: { header: "", detail: "" },
  postExists: true,
  comments: props.comments ?? undefined,
  content: parsedContent,
  likes: props.likes ?? undefined,
});

const repostData = props.repostData || null;

if (repostData || props.isRepost) {
  accountId = repostData.original_post_accountId || props.accountId;
  blockHeight = repostData.original_post_blockHeight || props.blockHeight;
  repostedByProfile = Social.get(
    `${repostData.reposted_by || props.repostedBy}/profile/**`,
    "final"
  );
  repostedByProfileUrl = `/near/widget/ProfilePage?accountId=${
    repostData.reposted_by || props.repostedBy
  }`;
  postUrl = `https://near.org/s/rp?a=${accountId}&b=${blockHeight}&rb=${
    repostData.reposted_by || props.repostedBy
  }`;
}

const edits = []; // Social.index('edit', { accountId, blockHeight }, { limit: 1, order: "desc", accountId })

const item = {
  type: "social",
  path: `${accountId}/post/main`,
  blockHeight,
};

const toggleEdit = () => {
  State.update({ editPost: !state.editPost });
};

// Load post if contents and comments are not passed in
if (!state.content || !state.comments || !state.likes) {
  const postsQuery = `
query IndexerQuery {
  dataplatform_near_social_feed_posts(
    order_by: {block_height: desc}
    where: {_and: {block_height: {_eq: ${blockHeight}}, account_id: {_eq: "${accountId}"}}}
  ) {
    account_id
    block_height
    block_timestamp
    content
    receipt_id
    accounts_liked
    comments(order_by: {block_height: asc}) {
      account_id
      block_height
      block_timestamp
      content
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

  fetchGraphQL(postsQuery, "IndexerQuery", {}).then((result) => {
    if (result.status === 200) {
      if (result.body.data) {
        const posts = result.body.data.dataplatform_near_social_feed_posts;
        if (posts.length > 0) {
          const post = posts[0];
          let content = JSON.parse(post.content);
          if (post.accounts_liked.length !== 0) {
            if (typeof post.accounts_liked === "string") {
              post.accounts_liked = JSON.parse(post.accounts_liked);
            }
          }
          const comments = post.comments;
          State.update({
            content: content,
            comments: comments,
            likes: post.accounts_liked,
          });
        } else {
          State.update({
            postExists: false,
          });
        }
      }
    }
  });

  if (state.postExists == false) {
    return "Post does not exist";
  }
  return "loading...";
}

const Post = styled.div`
  position: relative;
  &::before {
    content: "";
    display: block;
    position: absolute;
    left: 19px;
    top: 52px;
    bottom: 12px;
    width: 2px;
    background: #eceef0;
  }
`;

const Header = styled.div`
  margin-bottom: 0;
  display: inline-flex;
`;

const Body = styled.div`
  padding-left: 52px;
  padding-bottom: 1px;
`;

const Content = styled.div`
  img {
    display: block;
    max-width: 100%;
    max-height: 80vh;
    margin: 0 0 12px;
  }
`;

const Text = styled.p`
  display: block;
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  color: #687076;
  white-space: nowrap;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: -6px -6px 6px;
`;

const Comments = styled.div`
  > div > div:first-child {
    padding-top: 12px;
  }
`;
const CommentWrapper = styled.div`
  > div:first-child {
    > a:first-child {
      display: inline-flex;
      margin-bottom: 24px;
      font-size: 14px;
      line-height: 20px;
      color: #687076;
      outline: none;
      font-weight: 600;

      &:hover,
      &:focus {
        color: #687076;
        text-decoration: underline;
      }
    }
  }
`;

const TextLink = styled("Link")`
  display: inline block;
  margin: 0;
  font-size: 14px;
  line-height: 18px;
  color: ${(p) => (p.$bold ? "#11181C !important" : "#687076 !important")};
  font-weight: ${(p) => (p.$bold ? "600" : "400")};
  font-size: ${(p) => (p.$small ? "12px" : "14px")};
  overflow: ${(p) => (p.$ellipsis ? "hidden" : "visible")};
  text-overflow: ${(p) => (p.$ellipsis ? "ellipsis" : "unset")};
  white-space: nowrap;
  outline: none;

  &:focus,
  &:hover {
    text-decoration: underline;
  }
`;

const TagsWrapper = styled.div`
  padding-top: 4px;
`;

const optimisticallyHideItem = (message) => {
  State.update({
    hasBeenFlaggedOptimistic: true,
    showToast: true,
    flaggedMessage: message,
  });
};
const resolveHideItem = (message) => {
  State.update({
    hasBeenFlagged: true,
    showToast: true,
    flaggedMessage: message,
  });
};
const cancelHideItem = () => {
  State.update({
    hasBeenFlaggedOptimistic: false,
    showToast: false,
    flaggedMessage: { header: "", detail: "" },
  });
};

const renderComment = (a) => {
  return (
    <div key={JSON.stringify(a)}>
      <Widget
        src={`near/widget/Comments.Comment`}
        props={{
          accountId: a.account_id,
          blockHeight: a.block_height,
          content: a.content,
          highlight:
            a.account_id === props.highlightComment?.accountId &&
            a.block_height === props.highlightComment?.blockHeight,
          GRAPHQL_ENDPOINT,
          notifyAccountId,
          item,
        }}
      />
    </div>
  );
};

const renderedComments = state.comments.map(renderComment);

const addNewCommentFn = (newComment) => {
  State.update(state.comments.push(newComment));
};

return (
  <>
    {state.showToast && (
      <Widget
        src={`near/widget/DIG.Toast`}
        props={{
          type: "info",
          title: state.flaggedMessage.header,
          description: state.flaggedMessage.detail,
          open: state.showToast,
          onOpenChange: () => {
            State.update({ showToast: false });
          },
          duration: 5000,
        }}
      />
    )}
    {!state.hasBeenFlagged && (
      <Post id={`${accountId.replace(/[^a-z0-9]/g, "")}${blockHeight}`}>
        <>
          {repostData || isRepost ? (
            <Widget
              src="near/widget/AccountProfileOverlay"
              props={{
                accountId,
                profile,
                children: (
                  <div className="row">
                    <div className="col-auto ">
                      <i className="bi bi-repeat" /> reposted by{" "}
                      <TextLink href={repostedByProfileUrl} $ellipsis>
                        @{repostData.reposted_by}
                      </TextLink>
                      {tags.length > 0 && (
                        <TagsWrapper>
                          <Widget
                            src="near/widget/Tags"
                            props={{ tags, scroll: true }}
                          />
                        </TagsWrapper>
                      )}
                    </div>
                  </div>
                ),
                placement: props.overlayPlacement,
                verifications,
                showFlagAccountFeature,
              }}
            />
          ) : null}
        </>
        <Header>
          <div className="row">
            <div className="col-auto">
              <Widget
                src="near/widget/AccountProfile"
                props={{
                  profile: repostData ? null : profile,
                  verifications,
                  accountId: repostData
                    ? repostData.original_post_accountId
                    : accountId,
                  hideAccountId: true,
                  inlineContent: (
                    <>
                      <Text as="span">･</Text>
                      <Text>
                        <Widget
                          src="near/widget/TimeAgo"
                          props={{ blockHeight, blockTimestamp }}
                        />
                      </Text>
                      {false && edits.length > 0 && (
                        <Text as="span">･ Edited</Text>
                      )}
                    </>
                  ),
                  showFlagAccountFeature,
                }}
              />
            </div>
            <div className="col-1">
              <div style={{ position: "absolute", right: 0, top: "2px" }}>
                <Widget
                  src="near/widget/Posts.Menu"
                  props={{
                    item,
                    accountId: repostData.original_post_accountId || accountId,
                    blockHeight:
                      repostData.original_post_blockHeight || blockHeight,
                    parentFunctions: {
                      toggleEdit,
                      optimisticallyHideItem,
                      resolveHideItem,
                      cancelHideItem,
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </Header>

        {!state.hasBeenFlaggedOptimistic && (
          <Body>
            {state.content && (
              <Content>
                {state.content.text && !state.editPost && (
                  <Widget
                    src="near/widget/SocialMarkdown"
                    props={{ text: state.content.text }}
                  />
                )}

                {state.editPost && (
                  <div className="mb-2">
                    <Widget
                      src="near/widget/Posts.Edit"
                      props={{
                        item: { accountId, blockHeight },
                        content: state.content,
                        onEdit: toggleEdit,
                      }}
                    />
                  </div>
                )}

                {state.content.image && (
                  <Widget
                    src="mob.near/widget/Image"
                    props={{
                      image: state.content.image,
                    }}
                  />
                )}
              </Content>
            )}

            {blockHeight !== "now" && (
              <Actions>
                <Widget
                  src="near/widget/v1.LikeButton"
                  props={{
                    item,
                    notifyAccountId,
                    likes: state.likes,
                  }}
                />
                <Widget
                  src="near/widget/CommentButton"
                  props={{
                    item,
                    onClick: () =>
                      State.update({ showReply: !state.showReply }),
                  }}
                />
                <Widget
                  src="near/widget/Posts.RepostButton"
                  props={{
                    item,
                  }}
                />
                <Widget
                  src="near/widget/CopyUrlButton"
                  props={{
                    url: postUrl,
                  }}
                />
                <Widget
                  src="near/widget/ShareButton"
                  props={{
                    postType: "post",
                    url: postUrl,
                  }}
                />
              </Actions>
            )}
            {state.showReply && (
              <div className="mb-2">
                <Widget
                  src="near/widget/Comments.Compose"
                  props={{
                    notifyAccountId,
                    item,
                    onComment: () => State.update({ showReply: false }),
                    newAddedComment: addNewCommentFn,
                  }}
                />
              </div>
            )}
            {renderedComments && (
              <Comments>
                <CommentWrapper>{renderedComments}</CommentWrapper>
              </Comments>
            )}
          </Body>
        )}
      </Post>
    )}
  </>
);
