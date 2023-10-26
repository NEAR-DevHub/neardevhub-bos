const Tag = ({ tag }) => (
  <span
    class="badge me-1 text-dark fw-normal"
    style={{ border: "1px solid #D0D5DD" }}
  >
    {tag}
  </span>
);

return Tag(props);
