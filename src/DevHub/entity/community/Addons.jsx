const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Item = styled.div`
  padding: 10px;
  margin: 5px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Icon = styled.span`
  margin-right: 10px;
`;

const EditableField = styled.input`
  flex: 1;
`;

const ToggleButton = styled.input`
  margin-left: 10px;
`;

const Editor = ({ data, onUpdate, onMove, index, isTop, isBottom }) => {
  const handleNameChange = (event) => {
    const newName = event.target.value;
    onUpdate({ ...data, display_name: newName });
  };

  const handleIconChange = (event) => {
    const newIcon = event.target.value;
    onUpdate({ ...data, icon: newIcon });
  };

  const handleEnableChange = () => {
    onUpdate({ ...data, enabled: !data.enabled });
  };

  const moveItemUp = () => {
    if (!isTop) {
      onMove(index, index - 1);
    }
  };

  const moveItemDown = () => {
    if (!isBottom) {
      onMove(index, index + 1);
    }
  };

  return (
    <div>
      <Item>
        <div>
          <Widget
            src={"${REPL_DEVHUB}/widget/DevHub.components.molecule.Button"}
            props={{
              classNames: { root: "btn-sm btn-secondary" },
              icon: { type: "bootstrap_icon", variant: "bi-arrow-up" },
              onClick: moveItemUp,
              disabled: isTop,
            }}
          />
          <Widget
            src={"${REPL_DEVHUB}/widget/DevHub.components.molecule.Button"}
            props={{
              classNames: { root: "btn-sm btn-secondary" },
              icon: { type: "bootstrap_icon", variant: "bi-arrow-down" },
              onClick: moveItemDown,
              disabled: isBottom,
            }}
          />
        </div>
        <i className={data.icon} />
        <EditableField
          className="form-control border border-2"
          type="text"
          value={data.display_name}
          onChange={handleNameChange}
        />
        <Widget
          src={"${REPL_DEVHUB}/widget/DevHub.components.atom.Toggle"}
          props={{
            label: "Enabled",
            value: data.enabled,
            onChange: handleEnableChange,
          }}
        />
      </Item>
    </div>
  );
};

const AddonsConfigurator = ({ items }) => {
  const [list, setList] = useState(items);

  const updateItem = (updatedItem) => {
    const updatedList = list.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    setList(updatedList);
  };

  const moveItem = (fromIndex, toIndex) => {
    const updatedList = [...list];
    const [movedItem] = updatedList.splice(fromIndex, 1);
    updatedList.splice(toIndex, 0, movedItem);
    setList(updatedList);
  };

  return (
    <Container>
      {list.map((item, index) => (
        <Editor
          key={item.id}
          data={item}
          onUpdate={updateItem}
          onMove={moveItem}
          index={index}
          isTop={index === 0}
          isBottom={index === list.length - 1}
        />
      ))}
    </Container>
  );
};

return AddonsConfigurator(props);
