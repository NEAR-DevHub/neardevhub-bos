// Pagination not necessary since it won't be too many blogs per community
// a few hundred widgets per account are also not a problem
const { data, editPostId, handleItemClick, selectedItem } = props;

const options = { year: "numeric", month: "short", day: "numeric" };
const formattedDate = (date) => new Date(date).toLocaleString("en-US", options);

const blogData = [
  {
    id: "new",
    title: "New Blog Post",
    status: "DRAFT",
    createdAt: new Date().toISOString().slice(0, 10),
    updatedAt: new Date().toISOString().slice(0, 10),
    publishedAt: "mm-dd-yyyy",
    content: "",
    author: "",
    description: "",
    subtitle: "",
  },
  ...data,
];

return (
  <table
    id="manage-blog-table"
    className={`table table-hover table-sm ${props.hideColumns && "mt-5"}`}
  >
    <thead>
      <tr>
        <th scope="col">Name</th>
        {props.hideColumns ? null : (
          <>
            <th scope="col">Status</th>
            <th scope="col" data-testid="createdAt">
              Created At
            </th>
            <th scope="col" data-testid="updatedAt">
              Updated At
            </th>
            <th scope="col" data-testid="publishedAt">
              Visible Publish Date
            </th>
          </>
        )}
      </tr>
    </thead>
    <tbody>
      {(blogData || []).map((it) => {
        // Hide the new blog post item unless selectedItem is new
        if (it.id === "new" && selectedItem !== "new") {
          return;
        }

        return (
          <tr
            id={`edit-blog-selector-${it.id}`}
            key={it.id}
            onClick={() => handleItemClick(it)}
          >
            <td
              scope="row"
              className={
                it.id === selectedItem.id ||
                (it.id === "new" && selectedItem === "new")
                  ? "table-success"
                  : ""
              }
            >
              {it.title}
            </td>
            {!props.hideColumns ? (
              <>
                <td>{it.status}</td>
                <td>{formattedDate(it.createdAt)}</td>
                <td>{formattedDate(it.updatedAt)}</td>
                <td>{formattedDate(it.publishedAt)}</td>
              </>
            ) : null}
          </tr>
        );
      })}
    </tbody>
  </table>
);
