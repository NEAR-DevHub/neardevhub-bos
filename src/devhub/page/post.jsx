const { id } = props;

return (
  <div className="p-5">
    <Widget
      src={"${REPL_DEVHUB}/widget/devhub.entity.post.Post"}
      props={{
        id,
      }}
    />
  </div>
);
