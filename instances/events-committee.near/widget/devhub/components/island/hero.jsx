const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url");

href || (href = () => {});

const imageLink =
  "https://ipfs.near.social/ipfs/bafybeiap2mzwsly4apaldxguiunx4rjwqyadksj5yxuzwrww3kue3ao5qe";

const HeroSection = styled.div`
  position: relative;
  height: auto;
  z-index: 3;
  width: 70%;
  background: #00ec97;
  clip-path: polygon(0 0, 100% 0%, 75% 100%, 0% 100%);

  padding-top: 2rem;
  padding-bottom: 2rem;
  padding-left: 3.375rem;

  @media screen and (max-width: 768px) {
    width: 100%;
    padding: 1rem 1.5rem;
    clip-path: none;
  }
`;

const Title = styled.h1`
  color: #f4f4f4;
  font-size: 4rem;
  font-style: normal;
  font-weight: 700;
  line-height: 100%; /* 88px */
  letter-spacing: -1.76px;

  @media screen and (max-width: 768px) {
    font-size: 2.25rem;
    letter-spacing: -0.72px;
    margin: 0;
  }
`;

const Lead = styled.p`
  color: #151515;
  font-size: 1.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: 110%; /* 39.6px */

  width: 70%;

  @media screen and (max-width: 768px) {
    font-size: 1.5rem;
    width: 100%;
  }
`;

const CTA = styled.a`
  display: inline-flex;
  padding: 0.875rem 1rem;
  align-items: center;
  gap: 0.5rem;

  border-radius: 1rem;
  border: 1px solid #151515;

  color: #151515 !important;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 700;
  line-height: 120%; /* 28.8px */
  letter-spacing: -0.48px;

  &:hover {
    background: #151515;
    color: #f4f4f4 !important;
    text-decoration: none; // Remove underline on hover
  }

  @media screen and (max-width: 768px) {
    display: inline-flex;
    padding: 8px 16px;
    align-items: center;
    gap: 8px;

    border-radius: 16px;
    background: #00ec97;

    border: none;

    color: #f4f4f4 !important;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 120%; /* 19.2px */
    letter-spacing: -0.32px;

    &:hover {
      background: #151515;
      color: #f4f4f4;
      text-decoration: none; // Remove underline on hover
    }
  }
`;

const Container = styled.div`
  position: relative;
  width: 100%;
  height: max-content;
  overflow: hidden;

  @media screen and (max-width: 768px) {
    background: #f4f4f4;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  background: transparent;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const Image = styled.img`
  margin-left: 15.625rem;
  height: 100%;
  width: 100%;
  filter: grayscale(100%);
  object-fit: cover;
`;

const DesktopDescription = styled.div`
  @media screen and (max-width: 786px) {
    display: none;
  }
`;

const MobileImage = styled.img`
  display: none;

  width: 100%;
  height: 196px;

  width: 100%;
  object-fit: cover;
  filter: grayscale(1);

  @media screen and (max-width: 768px) {
    display: block;
  }
`;

const MobileDescription = styled.div`
  display: none;
  padding: 24px 16px;

  width: 100%;

  @media screen and (max-width: 768px) {
    display: block;
  }
`;

return (
  <Container>
    <HeroSection>
      <Title>
        The decentralized <br />
        <span style={{ color: "#101820" }}>home base</span> <br />
        for NEAR builders
      </Title>
      <DesktopDescription>
        <Lead>
          Join a vibrant community of innovators shaping the open web.
        </Lead>
        <Link
          to={href({
            widgetSrc: "${REPL_DEVHUB}/widget/app",
            params: {
              page: "about",
            },
          })}
        >
          <CTA href="#">Read more →</CTA>
        </Link>
      </DesktopDescription>
    </HeroSection>
    <MobileImage src={imageLink} />
    <ImageContainer>
      <Image src={imageLink} />
    </ImageContainer>
    <MobileDescription>
      <Lead>Join a vibrant community of innovators shaping the open web.</Lead>
      <Link
        to={href({
          widgetSrc: "${REPL_DEVHUB}/widget/app",
          params: {
            page: "about",
          },
        })}
      >
        <CTA href="#">Read more →</CTA>
      </Link>
    </MobileDescription>
  </Container>
);
