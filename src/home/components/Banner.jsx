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
  line-height: 100%; /* 88px */
  letter-spacing: -1.76px;
`;

const Lead = styled.p`
  color: #151515;
  font-size: 28px;
  font-style: normal;
  font-weight: 400;
  line-height: 110%; /* 39.6px */

  width: 70%;
`;

const CTA = styled.a`
  display: inline-flex;
  padding: 14px 16px;
  align-items: center;
  gap: 8px;

  border-radius: 16px;
  border: 1px solid #151515;

  color: #151515;
  font-size: 20px;
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
    <HeroSection className="h-auto z-3" style={{ width: "70%" }}>
      <Title>
        The decentralized <br />{" "}
        <span style={{ color: "#101820" }}>home base</span> <br />
        for NEAR builders
      </Title>
    </HeroSection>
    <div
      className="position-absolute top-0 z-n1 end-0 h-100"
      style={{ width: "100%" }}
    >
      <img
        src={imageLink}
        style={{
          marginLeft: "400px",
          height: "100%",
          width: "100%",
          filter: "grayscale(100%)",
          objectFit: "cover",
        }}
      />
    </div>
  </div>
);
