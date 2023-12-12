const { widget } = VM.require("${REPL_DEVHUB}/widget/core.lib.url");

widget || (widget = () => {});

const WorkspaceViewLayout = ({
  configurationControls,
  children,
  link,
  metadata,
  isConfiguratorActive,
  isSynced,
  onCancel,
  onConfigure,
  onDelete,
  onSave,
  permissions,
}) => (
  <div
    className="d-flex flex-column align-items-center gap-4 w-100"
    style={{ paddingBottom: 72 }}
  >
    <div
      className="d-flex justify-content-end gap-3 p-3 rounded-4 w-100"
      style={{
        backgroundColor: "#181818",
        zIndex: 100,
      }}
    >
      {typeof link === "string" && link.length > 0 ? (
        <>
          {widget("components.molecule.Button", {
            classNames: { root: "btn-sm btn-outline-secondary text-light" },
            href: link,
            icon: { type: "bootstrap_icon", variant: "box-arrow-up-right" },
            isHidden: "Disabled for MVP",
            label: "Open in new tab",
            rel: "noreferrer",
            role: "button",
            target: "_blank",
            type: "link",
          })}

          {widget("components.molecule.Button", {
            classNames: { root: "btn-sm btn-outline-secondary text-light" },
            icon: { type: "bootstrap_icon", variant: "bi-clipboard-fill" },
            isHidden: isConfiguratorActive,
            label: "Copy link",
            onClick: () =>
              clipboard.writeText(`${REPL_DEVHUB}/widget/devhub.${link}`),
          })}
        </>
      ) : null}

      {permissions.can_configure && (
        <>
          <div className="me-auto">
            {(configurationControls ?? []).map((controlProps) =>
              widget(
                "components.molecule.Button",
                {
                  classNames: {
                    root: "btn-sm btn-outline-secondary text-light",
                  },
                  ...controlProps,
                  isHidden: !isConfiguratorActive,
                },
                controlProps.label
              )
            )}
          </div>

          {widget("components.molecule.Button", {
            classNames: {
              root: "btn-sm btn-outline-warning shadow-none border-0",
            },

            isHidden: typeof onCancel !== "function" || !isConfiguratorActive,
            label: "Cancel",
            onClick: onCancel,
          })}

          {widget("components.molecule.Button", {
            classNames: { root: "btn-sm btn-primary" },
            icon: { type: "bootstrap_icon", variant: "bi-gear-wide-connected" },
            isHidden: typeof onConfigure !== "function" || isConfiguratorActive,
            label: "Configure",
            onClick: onConfigure,
          })}

          {widget("components.molecule.Button", {
            classNames: { root: "btn-sm btn-success" },
            disabled: isSynced,

            icon: {
              type: "svg_icon",
              variant: "floppy_drive",
              width: 14,
              height: 14,
            },

            isHidden: typeof onSave !== "function" || !isConfiguratorActive,
            label: "Save",
            onClick: onSave,
          })}

          {widget("components.molecule.Button", {
            classNames: {
              root: "btn-sm btn-outline-danger shadow-none border-0",
            },

            icon: { type: "bootstrap_icon", variant: "bi-recycle" },

            isHidden:
              "Disabled for MVP" ??
              (typeof onDelete !== "function" || isConfiguratorActive),

            label: "Delete",
            onClick: onDelete,
          })}
        </>
      )}
    </div>

    <div className="d-flex flex-column align-items-center gap-2 py-4">
      <h5 className="h5 d-inline-flex gap-2 m-0">
        {widget("components.atom.Icon", {
          type: "bootstrap_icon",
          variant: "bi-kanban-fill",
        })}

        <span>
          {(metadata.title?.length ?? 0) > 0 ? metadata.title : "Untitled view"}
        </span>
      </h5>

      <p className="m-0 py-1 text-secondary text-center">
        {(metadata.description?.length ?? 0) > 0
          ? metadata.description
          : "No description provided"}
      </p>
    </div>

    <div className="d-flex gap-3 w-100" style={{ overflowX: "auto" }}>
      {children}
    </div>
  </div>
);

return WorkspaceViewLayout(props);
