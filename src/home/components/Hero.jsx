const imageLink =
  "https://s3-alpha-sig.figma.com/img/b1f8/9258/16e820ecd12b0c541cdd7177d0b53a24?Expires=1698624000&Signature=owRGoRIMd35cUHfLyMvuYirlRCAdUoTn801J3ozXJRgFp~Pfy9yLCklGK~wigQK32HTJ6YET6QbAjeP20YEO5NE5ymAL9V3LBJGkVA-X-AcnZATk3QAEzM5S5cmmlFlzf~r4DLiKs5vFKPYYVUptoYlSFqmBIGGDNaBfdl5WvTLQqCXUyw62oHlsEi8RX3mO99L-UdttIpZHeJvJBBCj21HUzM461rULCxwkXBp6mvqmBq6kF0lhXDH4PcwVkiuzqRDSu0myL2hcaUY5QpFtm8tOuh0z-FMNtdImxqVtbH3CbD9J7xsOeFcpkAvQZFDRgtAAlnto0-lfASsWaioXSQ__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4";

const HeroSection = styled.div`
  background: #00ec97;
  clip-path: polygon(0 0, 100% 0%, 75% 100%, 0% 100%);

  padding-top: 32px;
  padding-bottom: 32px;
  padding-left: 54px;
`;

const Title = styled.h1`
  color: #f4f4f4;
  font-size: 64px;
  font-style: normal;
  font-weight: 700;
  line-height: 100%; /* 64px */
  letter-spacing: -1.28px;

  margin-bottom: 36px;
`;

const Lead = styled.p`
  color: #151515;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 110%; /* 26.4px */
  width: 85%;

  margin-bottom: 62px;
`;

const Content = styled.p`
  color: #151515;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 120%;

  width: 75%;
`;

return (
  <div className="position-relative w-100" style={{ height: "max-content" }}>
    <HeroSection className="h-auto z-3" style={{ width: "70%" }}>
      <Title>
        The decentralized <br />{" "}
        <span style={{ color: "#101820" }}>home base</span> <br />
        for NEAR builders
      </Title>
      <Lead>Join a vibrant community of innovators shaping the open web.</Lead>
      <Content>
        /dev/hub's mission is to foster a productive and innovative ecosystem of
        open-source developers on NEAR. <br />
        <br />
        Here you&apos;ll find a broad range of resources, including developer
        tools, funding, mentorship, and more. Whether you're a blockchain
        developer eager to contribute your skills to the common good or an
        advocate of the Open Web movement, /dev/hub is your gateway to shaping
        NEAR's incredible narrative and ecosystem.
      </Content>
    </HeroSection>
    <div
      className="position-absolute top-0 z-n1 end-0 h-100"
      style={{ width: "100%" }}
    >
      <img
        src={imageLink}
        style={{
          marginLeft: "250px",
          height: "100%",
          width: "100%",
          filter: "grayscale(100%)",
          objectFit: "cover",
        }}
      />
    </div>
  </div>
);
