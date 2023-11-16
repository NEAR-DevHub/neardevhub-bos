type TagProps = {
  black: boolean;
  tag: string;
};

export default function Tag(props: TagProps) {
  // TODO remove
  const REPL_DEVHUB_CONTRACT = "${REPL_DEVHUB_CONTRACT}";
  const REPL_DEVHUB_LEGACY = "${REPL_DEVHUB_LEGACY}";
  const REPL_DEVHUB = "${REPL_DEVHUB}";
  const REPL_NEAR = "${REPL_NEAR}";
  const REPL_MOB = "${REPL_MOB}";
  const REPL_EFIZ = "${REPL_EFIZ}";

  console.log({
    REPL_DEVHUB_CONTRACT,
    REPL_DEVHUB_LEGACY,
    REPL_DEVHUB,
    REPL_NEAR,
    REPL_MOB,
    REPL_EFIZ,
  });

  const { black, tag } = props;

  const Span = styled.span`
    color: ${black ? "#818181" : "#00ec97"};
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 20px; /* 125% */
  `;

  return <Span>{tag}</Span>;
}
