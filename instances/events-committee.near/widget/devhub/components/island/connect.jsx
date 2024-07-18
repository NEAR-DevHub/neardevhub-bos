const { getFeaturedCommunities } = VM.require(
  "${REPL_EVENTS}/widget/core.adapter.devhub-contract"
);

if (!getFeaturedCommunities) {
  return <p>Loading modules...</p>;
}

const communities = getFeaturedCommunities();

if (!communities) {
  return <p>Loading communities...</p>;
}

const [startIndex, setStartIndex] = useState(0);
const [endIndex, setEndIndex] = useState(2);

const DescriptionHeader = styled.h2`
  color: #f4f4f4;
  font-size: 1.75rem;
  font-style: normal;
  font-weight: 700;
  line-height: 120%; /* 43.2px */

  @media screen and (max-width: 786px) {
    font-size: 1.5rem;
  }
`;

const Description = styled.p`
  color: #f4f4f4;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 400;
  line-height: 120%; /* 28.8px */

  @media screen and (max-width: 786px) {
    font-size: 1rem;
  }
`;

const imageSource =
  "https://ipfs.near.social/ipfs/bafkreic7wxhocbnxoo63uh6n2ur3otykbzouymobt3ebgd2b4dmdiu3764";

const CardBody = styled.div`
  border-radius: 1rem;
  border: 1px solid #00ec97;
  background: #3f4040;

  display: flex;
  max-width: 31.5%;
  height: 12rem;
  padding: 1.5rem;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 0.5rem;
  flex-shrink: 0;
  align-self: stretch;

  h3 {
    color: #00ec97;
    font-size: 1.5rem;
    font-style: normal;
    font-weight: 700;
    line-height: 100%; /* 40px */
  }

  p {
    color: #818181;
    font-size: 1.125rem;
    font-style: normal;
    font-weight: 400;
    line-height: 120%; /* 28.8px */
  }

  a {
    color: #00ec97;
    font-size: 1.25rem;
    font-style: normal;
    font-weight: 700;
    line-height: 120%; /* 28.8px */

    &:hover {
      text-decoration: none;
    }
  }

  @media screen and (max-width: 768px) {
    max-width: 80%;
  }
`;

const Card = ({ title, description, href }) => {
  return (
    <CardBody>
      <h3>{title}</h3>
      <p>{description}</p>
      <a href={href}>Learn more →</a>
    </CardBody>
  );
};

const Cards = communities.map((com) => {
  return {
    title: com.name,
    description: com.description,
    href: "/${REPL_EVENTS}/widget/app?page=community&handle=" + com.handle,
  };
});

const ForwardButton = styled.button`
  all: unset;
  position: absolute;
  right: 0;

  margin: 1rem;

  &:hover,
  &:active {
    border: none;
    outline: none;
  }

  ${endIndex >= Cards.length - 1 && "svg {transform: rotate(180deg);}"}
`;

const handleForward = () => {
  if (endIndex <= Cards.length - 1) {
    setStartIndex(endIndex + 1);
    setEndIndex(endIndex + 3);
  } else {
    setStartIndex(0);
    setEndIndex(2);
  }
};

const CTA = styled.a`
  color: #00ec97 !important;
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 700;
  line-height: 120%; /* 28.8px */

  @media screen and (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const Subheading = styled.h3`
  color: #8a8e93;
  font-size: 2.25rem;
  font-style: normal;
  font-weight: 700;
  line-height: 120%; /* 43.2px */

  padding: 3rem;
  padding-top: 0;

  @media screen and (max-width: 786px) {
    padding: 1rem;
    padding-top: 0;
    font-size: 1.5rem;
  }
`;

const Container = styled.div`
  width: 100%;
  display: flex;
  position: relative;
  align-items: center;

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

const DescriptionContainer = styled.div`
  padding: 3rem;
  width: 55%;

  @media screen and (max-width: 768px) {
    padding: 1rem;
    width: 100%;
  }
`;

const ImageContainer = styled.div`
  position: absolute;
  top: 25%;
  right: 0;

  width: 50%;
  height: 65%;

  @media screen and (max-width: 768px) {
    position: relative;
    padding: 0 1rem;

    height: 225px;
    width: 100%;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 90%;
  object-fit: cover;
  clip-path: polygon(15% 0, 100% 0%, 100% 100%, 0% 100%);

  @media screen and (max-width: 768px) {
    clip-path: none;
  }
`;

const CardsContainer = styled.div`
  padding: 3rem;
  padding-top: 0;

  position: relative;
  display: flex;
  flex-direction: row;
  gap: 1rem;
  width: 100%;
  align-items: center;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const ArrowIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="49"
      viewBox="0 0 48 49"
      fill="none"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M32.9999 24.5L17.9999 39.5L15.8999 37.4L28.7999 24.5L15.8999 11.6L17.9999 9.5L32.9999 24.5Z"
        fill="#00EC97"
      />
    </svg>
  );
};

const CTAContainer = styled.div`
  padding: 3rem;
  padding-top: 0;

  @media screen and (max-width: 786px) {
    padding: 1rem;
    padding-top: 0;
  }
`;

const MobileCards = styled.div`
  display: none;

  @media screen and (max-width: 768px) {
    display: flex;
    padding: 1rem;
    flex-direction: row;
    overflow-x: auto;
    gap: 1rem;
  }
`;

const Content = (
  <>
    <Container>
      <DescriptionContainer>
        <DescriptionHeader>
          Communities are the lifeblood of /dev/hub
        </DescriptionHeader>
        <Description>
          We believe that communities are the foundation of a decentralized
          ecosystem. Explore and engage with our diverse range of communities
          today.
        </Description>
      </DescriptionContainer>
      <ImageContainer>
        <Image src={imageSource} />
      </ImageContainer>
    </Container>
    <Subheading>Featured Communities</Subheading>
    <CardsContainer>
      {Cards.slice(startIndex, endIndex + 1).map((card, idx) => (
        <Card
          title={card.title}
          description={card.description}
          href={card.href}
          key={`project-card-${idx}`}
        />
      ))}
      <ForwardButton onClick={handleForward}>
        <ArrowIcon />
      </ForwardButton>
    </CardsContainer>
    <MobileCards>
      {Cards.map((card, idx) => (
        <Card
          title={card.title}
          description={card.description}
          href={card.href}
          key={`mobile-card-${idx}`}
        />
      ))}
    </MobileCards>
    <CTAContainer>
      <CTA href="/${REPL_EVENTS}/widget/app?page=communities">
        Explore all communities →
      </CTA>
    </CTAContainer>
  </>
);

return (
  <Widget
    src="${REPL_EVENTS}/widget/devhub.components.island.home-section"
    props={{
      title: "/connect",
      children: Content,
      background: true,
    }}
  />
);
