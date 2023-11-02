const { items, handleItemClick, selectedItem } = props;

const SidebarContainer = styled.div`
  background-color: #f0f0f0;
  padding: 16px;
  width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SidebarButton = styled.button`
  border: 2px solid #333;
  padding: 8px;
  margin: 8px;
  width: 100%;
  text-align: center;
  cursor: pointer;
  background-color: ${({ selected }) => (selected ? "#4caf50" : "white")};
  color: ${({ selected }) => (selected ? "white" : "black")};
`;

return (
  <SidebarContainer>
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
