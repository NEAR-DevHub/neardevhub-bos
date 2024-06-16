const { identifier, editPost, setEditPost, useLabels, setUseLabels, disabled } =
  props;

return (
  <>
    <div class="form-check">
      <input
        class="form-check-input"
        type="checkbox"
        value={editPost}
        id={`editPostCheckbox${identifier}`}
        checked={editPost}
        onChange={() => setEditPost(!editPost)}
        disabled={disabled}
      />
      <label class="form-check-label" for={`editPostCheckbox${identifier}`}>
        This team is allowed to edit-post with this / these labels
      </label>
    </div>
    <div class="form-check">
      <input
        class="form-check-input"
        type="checkbox"
        value={useLabels}
        id={`useLabelsCheckbox${identifier}`}
        checked={useLabels}
        onChange={() => setUseLabels(!useLabels)}
        disabled={disabled}
      />
      <label class="form-check-label" for={`useLabelsCheckbox${identifier}`}>
        Only this team and moderators are allowed to use this label
      </label>
    </div>
  </>
);
