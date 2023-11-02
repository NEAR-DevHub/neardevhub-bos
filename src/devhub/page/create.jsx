const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url");

if (!href) {
  return <p>Loading modules...</p>;
}

/* INCLUDE: "core/lib/autocomplete" */
const autocompleteEnabled = true;

const AutoComplete = styled.div`
  z-index: 5;

  > div > div {
    padding: calc(var(--padding) / 2);
  }
`;

function textareaInputHandler(value) {
  const showAccountAutocomplete = /@[\w][^\s]*$/.test(value);
  State.update((lastKnownState) => ({
    ...lastKnownState,
    text: value,
    showAccountAutocomplete,
  }));
}

function autoCompleteAccountId(id) {
  let description = state.description.replace(/[\s]{0,1}@[^\s]*$/, "");
  description = `${description} @${id}`.trim() + " ";
  State.update((lastKnownState) => ({
    ...lastKnownState,
    description,
    showAccountAutocomplete: false,
  }));
}
/* END_INCLUDE: "core/lib/autocomplete" */

const activeOptionStyle = {
  backgroundColor: "#0C7283",
  color: "#f3f3f3",
};

const postTypeOptions = {
  Idea: {
    name: "Idea",
    icon: "bi-lightbulb",

    description:
      "Get feedback from the community about a problem, opportunity, or need.",
  },

  Solution: {
    name: "Solution",
    icon: "bi-rocket",

    description:
      "Provide a specific proposal or implementation to an idea, optionally requesting funding. If your solution relates to an existing idea, please reply to the original post with a solution.",
  },
};

const CreatePage = ({ transactionHashes }) => {
  const recoveredPostType = Storage.privateGet("post_type");

  const initialState = {
    post_type: recoveredPostType ?? postTypeOptions.Idea.name,
  };

  State.init(initialState);

  const stateReset = () => {
    Storage.privateSet("post_type", null);
    State.update(initialState);
  };

  if (typeof transactionHashes === "string") stateReset();

  if (recoveredPostType !== null) {
    State.update((lastKnownState) => ({
      ...lastKnownState,
      post_type: recoveredPostType,
    }));
  }

  const typeSwitch = (optionName) => {
    State.update((lastKnownState) => ({
      ...lastKnownState,
      post_type: optionName,
    }));

    Storage.privateSet("post_type", optionName);
  };

  return (
    <div
      className="d-flex flex-column gap-4 p-4 bg-light"
      data-bs-parent={`#accordion${postId}`}
      id={`${state.post_type}_post_spawner`}
    >
      {transactionHashes ? (
        <>
          <p
            className="d-flex flex-column justify-content-center align-items-center gap-3"
            style={{ height: 480 }}
          >
            <span>Post created successfully.</span>

            <a
              style={{ backgroundColor: "#3252A6" }}
              className="btn fw-bold"
              href={href("Feed")}
            >
              Back to feed
            </a>
          </p>

          <Widget
            src={"${REPL_DEVHUB}/widget/devhub.entity.post.PostEditor"}
            props={{ className: "d-none", transactionHashes }}
          />
        </>
      ) : (
        <>
          <div className="d-flex flex-column gap-3 w-100">
            <p className="card-title fw-bold fs-6">
              What do you want to create?
            </p>

            <div className="d-flex gap-3">
              {Object.values(postTypeOptions).map((option) => (
                <button
                  className={`btn btn-${
                    state.post_type === option.name
                      ? "primary"
                      : "outline-secondary"
                  }`}
                  data-testid={`btn-${option.name.toLowerCase()}`}
                  key={option.name}
                  onClick={() => typeSwitch(option.name)}
                  style={
                    state.post_type === option.name ? activeOptionStyle : null
                  }
                  type="button"
                >
                  <i className={`bi ${option.icon}`} />
                  <span>{option.name}</span>
                </button>
              ))}
            </div>

            <p className="text-muted w-75">
              {postTypeOptions[state.post_type].description}
            </p>
          </div>

          <Widget
            src={"${REPL_DEVHUB}/widget/devhub.entity.post.PostEditor"}
            props={{
              mode: "Create",
              onCancel: stateReset,
              parent_id: null,
              post_type: state.post_type,
              transactionHashes,
            }}
          />
        </>
      )}
    </div>
  );
};

return CreatePage(props);
