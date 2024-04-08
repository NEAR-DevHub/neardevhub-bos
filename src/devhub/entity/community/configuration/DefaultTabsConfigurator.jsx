const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url") || (() => {});

const availableTabs = [
  { title: "Announcements", enabled: true },
  { title: "Discussions", enabled: true },
  { title: "Activity", enabled: true },
  { title: "Teams", enabled: true },
];

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

const TabItem = ({ data, onUpdate, onMove, index, isTop, isBottom }) => {
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
        <Widget
          src="${REPL_DEVHUB}/widget/devhub.components.molecule.Input"
          props={{
            label: " ",
            value: data.title,
            onChange: () => null,
            inputProps: {
              disabled: true,
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
              key: data.title,
            }}
          />
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

const DefaultTabsConfigurator = ({ data, onSubmit }) => {
  const initial = availableTabs.map((tab) =>
    data.includes(tab.title)
      ? { title: tab.title, enabled: true }
      : { title: tab.title, enabled: false }
  );

  const orderedTabs = initial.slice().sort((a, b) => {
    const indexA = data.indexOf(a.title);
    const indexB = data.indexOf(b.title);

    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }

    if (indexA !== -1) {
      return -1;
    }
    if (indexB !== -1) {
      return 1;
    }

    return 0;
  });

  const [originalList, setOriginalList] = useState(orderedTabs);
  const [list, setList] = useState(orderedTabs);
  const [changesMade, setChangesMade] = useState(false);

  useEffect(() => {
    setOriginalList(orderedTabs);
  }, [orderedTabs]);

  // Enable or disable an item
  const updateItem = (updatedItem) => {
    const updatedList = list.map((item) =>
      item.title === updatedItem.title ? updatedItem : item
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

  return (
    <Container>
      <p>
        Order or hide default tabs, which will appear in your community's
        navigation bar.
        <br />
      </p>

      <Table>
        <Header>
          <Row>
            <HeaderCell style={{ width: "30px" }}>Order</HeaderCell>
            <HeaderCell>Tab Name</HeaderCell>
            <HeaderCell style={{ width: "45px" }}>Enabled</HeaderCell>
          </Row>
        </Header>
        <tbody>
          {list.map((item, index) => (
            <TabItem
              key={item}
              data={item}
              onUpdate={updateItem}
              onMove={moveItem}
              index={index}
              isTop={index === 0}
              isBottom={index === list.length - 1}
            />
          ))}
        </tbody>
      </Table>

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
              onClick: () =>
                onSubmit(
                  list
                    .map((item) => (item.enabled ? item.title : null))
                    .filter((item) => item !== null)
                ),
            }}
          />
        </div>
      )}
    </Container>
  );
};

return DefaultTabsConfigurator(props);
