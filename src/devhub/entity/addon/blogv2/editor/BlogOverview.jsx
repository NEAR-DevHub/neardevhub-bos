// TODO rename to blog overview
// pagination not necessary since it won't be too many blogs per community
// a few hundred widgets per account are also not a problem

const { data, editPostId, handleItemClick, selectedItem } = props;

const Container = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  gap: 4px;
`;

// justify-content: space-between;
const Button = styled.th`
  display: flex;
  padding: 14px 16px;
  text-align: center;
  cursor: pointer;
  gap: 16px;
  width: 100%;

  border-radius: 4px;
  border: 1px solid #00ec97;

  background-color: ${({ selected }) => (selected ? "#00ec97" : "white")};
  color: ${({ selected }) => (selected ? "white" : "black")};
`;

const TableRow = styled.tr`
  background-color: ${({ selected }) => (selected ? "#00ec97" : "white")};
  color: ${({ selected }) => (selected ? "white" : "black")};
`;

console.log("DATA in overview");
console.log({
  data,
});

const options = { year: "numeric", month: "short", day: "numeric" };
const formattedDate = (date) => new Date(date).toLocaleString("en-US", options);

// FIXME: this to the provider or don't do it?
const reshapedData =
  Object.keys(data || {}).map((key) => {
    return {
      id: key,
      title: data[key].metadata.title,
      status: data[key].metadata.status,
      createdAt: formattedDate(data[key].metadata.created_at),
      updatedAt: formattedDate(data[key].metadata.updated_at),
      publishedAt: formattedDate(data[key].metadata.published_at),
      body: data[key][""],
      author: data[key].metadata.author,
      description: data[key].description,
      subTitle: data[key].subTitle,
    };
  }) || [];

console.log({ reshapedData });

const blogData = [
  {
    id: "new",
    title: "New Blog Post",
    status: "DRAFT",
    createdAt: new Date().toISOString().slice(0, 10),
    updatedAt: new Date().toISOString().slice(0, 10),
    publishedAt: "mm-dd-yyyy",
    author: "",
    description: "",
    subTitle: "",
  },
  ...reshapedData,
  // {
  //   id: 1,
  //   title: "Blog Post 1",
  //   status: "Published",
  //   createdAt: "April 12, 2024 12:00 AM",
  //   updatedAt: "April 12, 2024 12:00 AM",
  //   publishedAt: "April 12, 2024 12:00 AM",
  // },
  // {
  //   id: 2,
  //   title: "Blog Post 2",
  //   status: "Published",
  //   createdAt: "April 12, 2024 12:00 AM",
  //   updatedAt: "April 12, 2024 12:00 AM",
  //   publishedAt: "April 12, 2024 12:00 AM",
  // },
  // {
  //   id: 3,
  //   title: "Blog Post 3",
  //   status: "Published",
  //   createdAt: "April 12, 2024 12:00 AM",
  //   updatedAt: "April 12, 2024 12:00 AM",
  //   publishedAt: "April 12, 2024 12:00 AM",
  // },
  // {
  //   post_id: 4,
  //   title: "Blog Post 4",
  //   status: "DRAFT",
  //   createdAt: "April 12, 2024 12:00 AM",
  //   updatedAt: "April 12, 2024 12:00 AM",
  //   publishedAt: "April 12, 2024 12:00 AM",
  // },
];

return (
  <table id="manage-blog-table" className="table table-hover">
    {/* TODO:  use data instead of blogData */}
    {/* <p>{JSON.stringify(data)}</p> */}
    <thead>
      {props.hideColumns ? null : (
        <tr>
          <th scope="col">Blog title</th>
          <td scope="col">Status</td>
          <td scope="col">Created At</td>
          <td scope="col">Updated At</td>
          <td scope="col">Visible Publish Date</td>
        </tr>
      )}
    </thead>
    <tbody>
      {(blogData || []).map((it) => {
        // Hide the 'New Blog Post' button if hideColumns is true
        if (it.id === "new" && selectedItem !== null) {
          return;
        }

        return (
          <TableRow
            id={`edit-blog-selector-${it.id}`}
            key={it.id}
            onClick={() => handleItemClick(it)}
          >
            <th
              scope="row"
              className={
                (it.id === selectedItem.id && selectedItem !== null) ||
                (it.id === "new" && selectedItem === null)
                  ? "table-primary"
                  : ""
              }
            >
              {it.title}
            </th>
            {!props.hideColumns ? (
              <>
                <td>{it.status}</td>
                <td>{it.createdAt}</td>
                <td>{it.updatedAt}</td>
                <td>{it.publishedAt}</td>
              </>
            ) : null}
          </TableRow>
        );
      })}
    </tbody>
  </table>
);
