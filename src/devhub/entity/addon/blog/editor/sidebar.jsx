const { items, handleItemClick, selectedItem } = props;

const SidebarContainer = styled.div`
  background-color: #f0f0f0;
  padding: 16px;
  width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  gap: 4px;
`;

const SidebarButton = styled.button`
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

return (
  <SidebarContainer>
    <p>Blog posts</p>
    <SidebarButton onClick={() => handleItemClick(null)}>New</SidebarButton>
    {(items || []).map((it) => (
      <SidebarButton
        key={it.post_id}
        selected={selectedItem.id === it.post_id}
        onClick={() => handleItemClick(it.post_id)}
      >
        {it.post_id}
      </SidebarButton>
    ))}
  </SidebarContainer>
);
