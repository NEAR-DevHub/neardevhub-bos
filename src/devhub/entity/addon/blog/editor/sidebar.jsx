const { items, handleItemClick, selectedItem } = props;

return (
  <div>
    <h1>Sidebar</h1>
    {(items || []).map((it) => (
      <button onClick={() => handleItemClick(it.post_id)}>{it.post_id}</button>
    ))}
    <p>selected item: {selectedItem}</p>
  </div>
);
