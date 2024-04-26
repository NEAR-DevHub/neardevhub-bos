// Pagination not necessary since it won't be too many blogs per community
// a few hundred widgets per account are also not a problem
const { data, editPostId, handleItemClick, selectedItem } = props;

const options = { year: "numeric", month: "short", day: "numeric" };
const formattedDate = (date) => new Date(date).toLocaleString("en-US", options);

// TODO move this to the provider
const reshapedData =
  Object.keys(data || {}).map((key) => {
    return {
      id: key,
      content: data[key][""],
      createdAt: formattedDate(data[key].metadata.createdAt),
      updatedAt: formattedDate(data[key].metadata.updatedAt),
      publishedAt: formattedDate(data[key].metadata.publishedAt),
      ...data[key].metadata,
      // title: data[key].metadata.title,
      // status: data[key].metadata.status,
      // author: data[key].metadata.author,
      // description: data[key].metadata.description,
      // subtitle: data[key].metadata.subtitle,
      // category: data[key].metadata.category,
    };
  }) ||
  // .sort((blog1, blog2) => {
  //   // sort by published date
  //   return new Date(blog2.publishedAt) - new Date(blog1.publishedAt);
  // })
  [];

console.log("reshapedData", reshapedData);

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
  ...reshapedData,
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
            <th scope="col">Created At</th>
            <th scope="col">Updated At</th>
            <th scope="col">Visible Publish Date</th>
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
                <td>{it.createdAt}</td>
                <td>{it.updatedAt}</td>
                <td>{it.publishedAt}</td>
              </>
            ) : null}
          </tr>
        );
      })}
    </tbody>
  </table>
);
