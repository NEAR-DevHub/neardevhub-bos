const { editPost, setEditPost, useLabels, setUseLabels, disabled } = props;

setUseLabels = setUseLabels || (() => null);
setEditPost = setEditPost || (() => null);

return (
  <>
    <div class="form-check">
      <input
        class="form-check-input"
        type="checkbox"
        value="edit-post"
        id="flexCheckDefault"
        checked={editPost}
        onChange={setEditPost(e.target.value)}
        disabled={disabled}
      />
      <label class="form-check-label" for="flexCheckDefault">
        This team is allowed to edit-post with this / these labels
      </label>
    </div>
    <div class="form-check">
      <input
        class="form-check-input"
        type="checkbox"
        value="use-labels"
        id="flexCheckChecked"
        checked={useLabels}
        onChange={setUseLabels(e.target.value)}
        disabled={disabled}
      />
      <label class="form-check-label" for="flexCheckChecked">
        Only this team and moderators are allowed to use this label
      </label>
    </div>
  </>
);
