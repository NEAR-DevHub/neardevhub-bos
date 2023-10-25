const { getAvailableAddons } =
  VM.require("${REPL_DEVHUB}/widget/core.adapter.devhub-contract") ||
  (() => {});

const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url") || (() => {});

const availableAddons = getAvailableAddons() || [];

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

function generateRandom6CharUUID() {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyz";
  let result = "";

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }

  return result;
}

const AddonItem = ({
  data,
  onUpdate,
  onMove,
  onRemove,
  index,
  isTop,
  isBottom,
}) => {
  const handleNameChange = (event) => {
    const newName = event.target.value;
    onUpdate({ ...data, display_name: newName });
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

  const removeItem = () => {
    onRemove(data.id);
  };

  return (
    <div>
      <Item>
        <div>
          <div style={{ display: "flex", gap: "0" }}>
            <button
              className="btn btn-sm btn-secondary rounded-0"
              onClick={moveItemUp}
              disabled={isTop}
            >
              <i className="bi bi-arrow-up"></i>
            </button>
            <button
              className="btn btn-sm btn-secondary rounded-0"
              onClick={moveItemDown}
              disabled={isBottom}
            >
              <i className="bi bi-arrow-down"></i>
            </button>
          </div>
        </div>
        <EditableField
          className="form-control border border-2"
          type="text"
          value={data.display_name}
          disabled={!data.enabled}
          onChange={handleNameChange}
        />
        <Widget
          src={"${REPL_DEVHUB}/widget/devhub.components.atom.Toggle"}
          props={{
            label: "Enabled:",
            value: data.enabled,
            onChange: handleEnableChange,
          }}
        />
        {/* TODO: Redirects to the addon to configure there */}
        {/* <button className="btn btn-outline-secondary">
          Edit
          <i className="bi bi-box-arrow-in-up-right" />
        </button> */}
        <button className="btn btn-outline-danger" onClick={removeItem}>
          <i className="bi bi-trash-fill" />
        </button>
      </Item>
    </div>
  );
};

function arraysAreEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
}

const AddonsConfigurator = ({ data, onSubmit }) => {
  const [originalList, setOriginalList] = useState(data);
  const [list, setList] = useState(data);
  const [changesMade, setChangesMade] = useState(false);

  useEffect(() => {
    setOriginalList(data);
  }, [data]);

  const updateItem = (updatedItem) => {
    const updatedList = list.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    setList(updatedList);
    setChangesMade(!arraysAreEqual(originalList, updatedList));
  };

  const moveItem = (fromIndex, toIndex) => {
    const updatedList = [...list];
    const [movedItem] = updatedList.splice(fromIndex, 1);
    updatedList.splice(toIndex, 0, movedItem);
    setList(updatedList);
    setChangesMade(!arraysAreEqual(originalList, updatedList));
  };

  const [selectedAddon, setSelectedAddon] = useState(null);

  const handleAddItem = () => {
    const newItem = {
      id: generateRandom6CharUUID(),
      addon_id: selectedAddon.id,
      display_name: selectedAddon.title,
      enabled: true,
      parameters: "{}",
    };
    const updatedList = [...list, newItem];
    setList(updatedList);
    setChangesMade(!arraysAreEqual(originalList, updatedList));
  };

  const removeItem = (id) => {
    const updatedList = list.filter((item) => item.id !== id);
    setList(updatedList);
    setChangesMade(!arraysAreEqual(originalList, updatedList));
  };

  return (
    <Container>
      {list.map((item, index) => (
        <AddonItem
          key={item.id}
          data={item}
          onUpdate={updateItem}
          onMove={moveItem}
          onRemove={removeItem}
          index={index}
          isTop={index === 0}
          isBottom={index === list.length - 1}
        />
      ))}
      {availableAddons && list.length < 7 && (
        <div className="d-flex justify-content-center">
          <div className="d-flex gap-2 flex-grow-1 px-4">
            <Widget
              src={"${REPL_NEAR}/widget/DIG.InputSelect"}
              props={{
                groups: [
                  {
                    items: (availableAddons || []).map((it) => ({
                      label: it.title,
                      value: it.id,
                    })),
                  },
                ],
                rootProps: {
                  value: selectedAddon.id ?? null,
                  placeholder: "Select an addon",
                  onValueChange: (value) =>
                    setSelectedAddon(
                      (availableAddons || []).find((it) => it.id === value)
                    ),
                },
              }}
            />
            <button
              className="btn btn-success"
              onClick={handleAddItem}
              disabled={!selectedAddon}
            >
              <i className="bi bi-plus" />
            </button>
          </div>
        </div>
      )}
      <div
        className={"d-flex align-items-center justify-content-end gap-3 mt-4"}
      >
        <Widget
          src={"${REPL_DEVHUB}/widget/devhub.components.molecule.Button"}
          props={{
            classNames: { root: "btn-success" },
            disabled: !changesMade,
            icon: {
              type: "bootstrap_icon",
              variant: "bi-check-circle-fill",
            },
            label: "Submit",
            onClick: () => onSubmit(list),
          }}
        />
      </div>
    </Container>
  );
};

return AddonsConfigurator(props);
