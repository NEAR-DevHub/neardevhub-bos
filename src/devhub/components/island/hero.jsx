const imageLink =
  "https://ipfs.near.social/ipfs/bafybeiap2mzwsly4apaldxguiunx4rjwqyadksj5yxuzwrww3kue3ao5qe";

const HeroSection = styled.div`
  height: auto;
  z-index: 3;
  width: 70%;
  background: #00ec97;
  clip-path: polygon(0 0, 100% 0%, 75% 100%, 0% 100%);

  padding-top: 2rem;
  padding-bottom: 2rem;
  padding-left: 3.375rem;
`;

const Title = styled.h1`
  color: #f4f4f4;
  font-size: 4rem;
  font-style: normal;
  font-weight: 700;
  line-height: 100%; /* 88px */
  letter-spacing: -1.76px;
`;

const Lead = styled.p`
  color: #151515;
  font-size: 1.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: 110%; /* 39.6px */

  width: 70%;
`;

const CTA = styled.a`
  display: inline-flex;
  padding: 0.875rem 1rem;
  align-items: center;
  gap: 0.5rem;

  border-radius: 1rem;
  border: 1px solid #151515;

  color: #151515;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 700;
  line-height: 120%; /* 28.8px */
  letter-spacing: -0.48px;
`;

const Container = styled.div`
  position: relative;
  width: 100%;
  height: max-content;
  overflow: hidden;
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  z-index: -1;
  right: 0;
`;

const Image = styled.img`
  margin-left: 15.625rem;
  height: 100%;
  width: 100%;
  filter: grayscale(100%);
  object-fit: cover;
`;

return (
  <Container>
    <HeroSection>
      <Title>
        The decentralized <br />
        <span style={{ color: "#101820" }}>home base</span> <br />
        for NEAR builders
      </Title>
      <Lead>Join a vibrant community of innovators shaping the open web.</Lead>
      <CTA href="#">Read more →</CTA>
    </HeroSection>
    <ImageContainer>
      <Image src={imageLink} />
    </ImageContainer>
  </Container>
);
