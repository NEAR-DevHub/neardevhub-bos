const cidToURL = (cid) => `https://ipfs.near.social/ipfs/${cid}`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 24px;
  background: #fffefe;
  border-radius: 16px;
  overflow: hidden;
  border: 1px rgba(129, 129, 129, 0.3) solid;
  display: inline-flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 24px;
`;

const InfoContainer = styled.div`
  padding-right: 16px;
  display: inline-flex;
  justify-content: flex-start;
  align-items: center;
  gap: 16px;
`;

const InfoText = styled.div`
  color: ${(props) => props.color || "#818181"};
  font-size: 16px;
  font-family: ${(props) => props.fontFamily || "Aeonik Fono"};
  font-weight: ${(props) => props.fontWeight || "400"};
  line-height: 20px;
  word-wrap: break-word;
`;

const TitleContainer = styled.div`
  width: 344px;
  padding-right: 16px;
  display: inline-flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
`;

const Title = styled.div`
  width: 422px;
  color: #151515;
  font-size: 36px;
  font-family: "Aeonik";
  font-weight: 700;
  line-height: 39.6px;
  word-wrap: break-word;
`;

const DescriptionContainer = styled.div`
  align-self: stretch;
  height: 155px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

const Description = styled.div`
  align-self: stretch;
  height: 103px;
  padding-bottom: 16px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 16px;
`;

const DescriptionText = styled.div`
  align-self: stretch;
  color: #151515;
  font-size: 24px;
  font-family: "Aeonik";
  font-weight: 400;
  line-height: 28.8px;
  word-wrap: break-word;
`;

const TagsContainer = styled.div`
  padding: 16px;
  border-radius: 360px;
  overflow: hidden;
  display: inline-flex;
  justify-content: flex-start;
  align-items: center;
  gap: 16px;
`;

const Separator = styled.div`
  color: #8a8e93;
  font-size: 16px;
  font-family: "Circular Std";
  font-weight: 400;
  line-height: 19.2px;
  word-wrap: break-word;
`;

function Card({ labels, data }) {
  const { title, subtitle, description, category, author, image, community, date } = data;

  function formatDate(date) {
    const options = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    };
    return date.toLocaleString("en-US", options).replace(",", "");
  }

  return (
    <Container>
      <InfoContainer>
        <InfoText color="#F40303" fontWeight="700">
          {category && category.toUpperCase()}
        </InfoText>
        <Separator>·</Separator>
        <InfoText>{date && formatDate(date)}</InfoText>
      </InfoContainer>
      <TitleContainer>
        <Title>{title}</Title>
      </TitleContainer>
      <DescriptionContainer>
        <Description>
          <DescriptionText>{description}</DescriptionText>
        </Description>
        <TagsContainer>
          {(labels || []).map((label, index) => (
            <div key={label}>
              {index > 0 && <Separator />}
              <InfoText fontWeight="700">{label}</InfoText>
            </div>
          ))}
        </TagsContainer>
      </DescriptionContainer>
    </Container>
  );
}

return { Card };
