const category = props.category;
const getClassNameByCategory = (category) => {
  switch (category) {
    case "Bounty":
      return "purple";
    case "Bounty booster":
      return "yellow";
    case "Event sponsorship":
      return "cyan";
    case "Events team":
      return "mustard";
    case "Hackathon":
      return "red";
    case "Hackbox":
      return "green";
    case "Meetup":
      return "pink";
    case "Travel expenses":
      return "grey";
    default:
      return "grey";
  }
};

const Container = styled.div`
  @media screen and (max-width: 768px) {
    font-size: 11px;
  }
  font-size: 13px;
  .tag {
    color: white;
    padding-inline: 6px;
    padding-block: 3px;
  }
  .purple-bg {
    background-color: #7c66dc;
  }
  .yellow-bg {
    background-color: #dcc266;
  }
  .cyan-bg {
    background-color: #0daebb;
  }
  .pink-bg {
    background-color: #d366dc;
  }
  .grey-bg {
    background-color: #818181;
  }
  .red-bg {
    background-color: #dc6666;
  }
  .green-bg {
    background-color: #04a46e;
  }
  .mustard-bg {
    background-color: #dc9866;
  }
`;

return (
  <Container>
    <div className={getClassNameByCategory() + "-bg rounded-1 tag"}>
      {category}
    </div>
  </Container>
);
