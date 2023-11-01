const { getAllAddons } =
  VM.require("${REPL_DEVHUB}/widget/core.adapter.devhub-contract") ||
  (() => {});

const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url") || (() => {});

const availableAddons = getAllAddons() || [];

const isActive = props.isActive;

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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Header = styled.thead`
  background-color: #f0f0f0;
`;

const HeaderCell = styled.th`
  padding: 10px;
  text-align: left;
`;

const Row = styled.tr``;

const Cell = styled.td`
  padding: 10px;
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

  const addonMatch =
    availableAddons.find((it) => it.id === data.addon_id) ?? null;

  return (
    <Row>
      <Cell>
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          <button
            className="btn btn-sm btn-secondary rounded-0"
            onClick={moveItemUp}
            disabled={!isActive || isTop}
            style={{ visibility: isTop && !isBottom ? "hidden" : "visible" }}
          >
            <i className="bi bi-arrow-up"></i>
          </button>
          <button
            className="btn btn-sm btn-secondary rounded-0"
            onClick={moveItemDown}
            disabled={!isActive || isBottom}
            style={{ visibility: isBottom && !isTop ? "hidden" : "visible" }}
          >
            <i className="bi bi-arrow-down"></i>
          </button>
        </div>
      </Cell>
      <Cell>
        <div>{addonMatch.title}</div>
      </Cell>
      <Cell>
        <Widget
          src="${REPL_DEVHUB}/widget/devhub.components.molecule.Input"
          props={{
            label: " ",
            value: data.display_name,
            onChange: handleNameChange,
            inputProps: {
              min: 3,
              max: 30,
              disabled: !data.enabled || !isActive,
            },
          }}
        />
      </Cell>
      <Cell>
        <div
          className={
            "d-flex flex-column flex-1 align-items-start justify-content-evenly"
          }
        >
          <Widget
            src={"${REPL_DEVHUB}/widget/devhub.components.atom.Toggle"}
            props={{
              value: data.enabled,
              onChange: handleEnableChange,
              disabled: !isActive,
            }}
          />
        </div>
      </Cell>
      <Cell>
        <div style={{ display: "flex", gap: "2px" }}>
          {isActive && (
            <button className="btn btn-outline-danger" onClick={removeItem}>
              <i className="bi bi-trash-fill" />
            </button>
          )}
        </div>
      </Cell>
    </Row>
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
    setSelectedAddon(null);
  };

  const removeItem = (id) => {
    const updatedList = list.filter((item) => item.id !== id);
    setList(updatedList);
    setChangesMade(!arraysAreEqual(originalList, updatedList));
  };

  return (
    <Container>
      <p>
        Add or remove custom tabs, which will appear in your community's
        navigation bar.
        <br />
        You can customize them on each page.
      </p>
      {list.length > 0 && (
        <Table>
          <Header>
            <Row>
              <HeaderCell style={{ width: "30px" }}>Order</HeaderCell>
              <HeaderCell>Tab Type</HeaderCell>
              <HeaderCell>Tab Name</HeaderCell>
              <HeaderCell style={{ width: "45px" }}>Enabled</HeaderCell>
              <HeaderCell style={{ width: "40px" }}>Actions</HeaderCell>
            </Row>
          </Header>
          <tbody>
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
          </tbody>
        </Table>
      )}
      {isActive && availableAddons && list.length < 7 && (
        <div className="d-flex justify-content-center pt-2">
          <div className="d-flex gap-2 flex-grow-1 px-4">
            <Widget
              src={"${REPL_DEVHUB}/widget/devhub.components.molecule.Select"}
              props={{
                className: "flex-grow-1",
                options: availableAddons.map((addon) => ({
                  label: addon.title,
                  value: addon.id,
                })),
                value: selectedAddon.id ?? "",
                onChange: (e) =>
                  setSelectedAddon(
                    availableAddons.find((addon) => addon.id === e.target.value)
                  ),
                placeholder: "Select an addon",
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
      {isActive && (
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
      )}
    </Container>
  );
};

return AddonsConfigurator(props);
