const imageLink =
  "https://ipfs.near.social/ipfs/bafybeiap2mzwsly4apaldxguiunx4rjwqyadksj5yxuzwrww3kue3ao5qe";

const HeroSection = styled.div`
  background: #00ec97;
  clip-path: polygon(0 0, 100% 0%, 75% 100%, 0% 100%);

  height: auto;
  z-index: 3;
  width: 70%;

  padding-top: 2rem;
  padding-bottom: 2rem;
  padding-left: 3.375rem;
`;

const Image = styled.img`
  margin-left: 400px;
  height: 100%;
  width: 100%;
  filter: grayscale(100%);
  object-fit: cover;
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

return (
  <div
    className="position-relative w-100 overflow-hidden"
    style={{ height: "max-content" }}
  >
    <HeroSection>
      <Title>
        The decentralized <br />{" "}
        <span style={{ color: "#101820" }}>home base</span> <br />
        for NEAR builders
      </Title>
    </HeroSection>
    <div className="position-absolute top-0 z-n1 end-0 h-100 w-100">
      <Image src={imageLink} />
    </div>
  </div>
);
