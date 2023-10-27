const Span = styled.span`
  color: #818181;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 20px; /* 125% */
`;

const Tag = ({ tag }) => <Span>{tag}</Span>;

return Tag(props);
