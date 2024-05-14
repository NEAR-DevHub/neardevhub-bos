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
    publishedAt: "yyyy-MM-dd",
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
    className={`w-full table-auto text-sm text-left ${
      props.hideColumns && "mt-5"
    }`}
  >
    <thead className="bg-gray-50 text-gray-600 font-medium border-b">
      <tr>
        <th className="py-3 px-6">Name</th>
        {props.hideColumns ? null : (
          <>
            <th className="py-3 px-6">Status</th>
            <th className="py-3 px-6" data-testid="createdAt">
              Created At
            </th>
            <th className="py-3 px-6" data-testid="updatedAt">
              Updated At
            </th>
            <th className="py-3 px-6" data-testid="publishedAt">
              Visible Publish Date
            </th>
          </>
        )}
      </tr>
    </thead>
    <tbody className="text-gray-600 divide-y">
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
            <td scope="row" className={`px-6 py-4 whitespace-nowrap`}>
              {it.id === selectedItem.id ||
              (it.id === "new" && selectedItem === "new") ? (
                <span
                  className={`px-3 py-2 rounded-full font-semibold text-xs ${"text-green-600 bg-green-50"}`}
                >
                  {it.title}
                </span>
              ) : (
                it.title
              )}
            </td>
            {!props.hideColumns ? (
              <>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-2 rounded-full font-semibold text-xs ${
                      it.status == "PUBLISH"
                        ? "text-green-600 bg-green-50"
                        : "text-blue-600 bg-blue-50"
                    }`}
                  >
                    {it.status == "PUBLISH" ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formattedDate(it.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formattedDate(it.updatedAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formattedDate(it.publishedAt)}
                </td>
              </>
            ) : null}
          </tr>
        );
      })}
    </tbody>
  </table>
);
