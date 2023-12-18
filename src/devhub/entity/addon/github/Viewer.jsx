const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url");
const { widget } = VM.require("${REPL_DEVHUB}/widget/core.lib.url");
const { useQuery } = VM.require(
  "${REPL_DEVHUB}/widget/core.adapter.devhub-contract"
);

useQuery || (useQuery = () => {});

href || (href = () => {});
widget || (widget = () => {});
const { kanbanBoards, handle, permissions } = props;

if (!kanbanBoards) {
  return <div>Loading...</div>;
}

const data = Object.values(kanbanBoards)?.[0];

const [isEditScreenActive, setEditScreenActive] = useState(true);

return widget(`entity.addon.${data.metadata.type}`, {
  ...data,
  isConfiguratorActive: false,
  isSynced: true,
  link: href({
    widgetSrc: "${REPL_DEVHUB}/widget/app",
    params: { page: "community", handle },
  }),
  onConfigure: () => setEditScreenActive(!isEditScreenActive),
  permissions,
});
