const item = props.item;
const proposalId = props.proposalId;

if (!item) {
  return "";
}

const likes = Social.index("like", item);

const dataLoading = likes === null;

const likesByUsers = {};

(likes || []).forEach((like) => {
  if (like.value.type === "like") {
    likesByUsers[like.accountId] = like;
  } else if (like.value.type === "unlike") {
    delete likesByUsers[like.accountId];
  }
});
if (state.hasLike === true) {
  likesByUsers[context.accountId] = {
    accountId: context.accountId,
  };
} else if (state.hasLike === false) {
  delete likesByUsers[context.accountId];
}

const accountsWithLikes = Object.keys(likesByUsers);
const hasLike = context.accountId && !!likesByUsers[context.accountId];
const hasLikeOptimistic =
  state.hasLikeOptimistic === undefined ? hasLike : state.hasLikeOptimistic;
const totalLikes =
  accountsWithLikes.length +
  (hasLike === false && state.hasLikeOptimistic === true ? 1 : 0) -
  (hasLike === true && state.hasLikeOptimistic === false ? 1 : 0);

const LikeButton = styled.button`
  border: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #687076;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  cursor: pointer;
  background: none;
  padding: 6px;
  transition: color 200ms;

  i {
    font-size: 16px;
    transition: color 200ms;

    &.bi-heart-fill {
      color: #e5484d !important;
    }
  }

  &:hover,
  &:focus {
    outline: none;
    color: #11181c;
  }
`;

const likeClick = (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (state.loading) {
    return;
  }

  State.update({
    loading: true,
    hasLikeOptimistic: !hasLike,
  });

  const data = {
    index: {
      like: JSON.stringify({
        key: item,
        value: {
          type: hasLike ? "unlike" : "like",
        },
      }),
    },
  };

  if (
    !hasLike &&
    props.notifyAccountId &&
    props.notifyAccountId !== context.accountId
  ) {
    if (proposalId) {
      data.index.notify = JSON.stringify({
        key: props.notifyAccountId,
        value: {
          type: "devhub/like",
          item,
          proposal: proposalId,
        },
      });
    } else {
      data.index.notify = JSON.stringify({
        key: props.notifyAccountId,
        value: {
          type: "like",
          item,
        },
      });
    }
  }
  Social.set(data, {
    onCommit: () => State.update({ loading: false, hasLike: !hasLike }),
    onCancel: () =>
      State.update({
        loading: false,
        hasLikeOptimistic: !state.hasLikeOptimistic,
      }),
  });
};

const title = hasLike ? "Unlike" : "Like";

return (
  <LikeButton
    disabled={state.loading || dataLoading || !context.accountId}
    title={title}
    onClick={likeClick}
  >
    <i className={`${hasLikeOptimistic ? "bi-heart-fill" : "bi-heart"}`} />
    {Object.values(likesByUsers ?? {}).length > 0 ? (
      <span className={`count ${hasLike ? "liked" : ""}`}>
        <Widget
          loading={likeCount || ""}
          src="mob.near/widget/N.Overlay.Faces"
          props={{ accounts: likesByUsers, limit: 10 }}
        />
      </span>
    ) : (
      "0"
    )}
  </LikeButton>
);
