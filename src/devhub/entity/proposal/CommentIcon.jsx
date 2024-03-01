const item = props.item;
const showOverlay = props.showOverlay ?? true;

if (!props.hideCount && !item) {
  return "";
}

const comments = !props.hideCount && Social.index("comment", item);
const dataLoading = props.hideCount ? false : comments === null;
const totalComments = comments?.length || 0;

const CommentButton = styled.button`
  border: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #687076;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  cursor: pointer;
  background: none;
  padding: 6px;
  transition: color 200ms;

  i {
    font-size: 16px;
    transition: color 200ms;
  }

  &:hover,
  &:focus {
    outline: none;
    color: #11181c;
  }
`;

return (
  <CommentButton
    disabled={dataLoading || !context.accountId}
    title={showOverlay && "Add Comment"}
    onClick={props.onClick}
  >
    <i className="bi-chat" />
    {!props.hideCount && totalComments}
  </CommentButton>
);
