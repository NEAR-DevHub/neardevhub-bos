const PostSpawner = (postType) => {
  return (
    <div
      class={`collapse ${
        draftState?.parent_post_id == postId && draftState?.postType == postType
          ? "show"
          : ""
      }`}
      id={`collapse${postType}Creator${postId}`}
      data-bs-parent={`#accordion${postId}`}
    >
      {widget("entity.post.editor", {
        postType,
        onDraftStateChange: props.onDraftStateChange,
        draftState:
          draftState?.parent_post_id == postId ? draftState : undefined,
        parentId: postId,
        mode: "Create",
      })}
    </div>
  );
};

return PostSpawner(props);
