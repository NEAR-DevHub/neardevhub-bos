const page = props.page;

const Footer = styled.div`
  width: 100%;
  background-color: #00ec97;
  padding: 2rem;
  margin-top: 2rem;
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;

  @media screen and (max-width: 768px) {
    padding: 1rem;
  }
`;

const CTA = styled.a`
  display: inline-flex;
  padding: 0.5rem 0.8rem;
  align-items: center;
  gap: 0.5rem;

  border-radius: 0.5rem;
  border: 1px solid #151515;

  color: #151515 !important;
  font-size: 0.8rem;
  font-style: normal;
  font-weight: 700;
  line-height: 120%; /* 28.8px */
  letter-spacing: -0.48px;

  &:hover {
    background: #151515;
    color: #f4f4f4 !important;
    text-decoration: none; // Remove underline on hover
  }
`;

const XIcon = () => {
  return (
    <svg
      width="20"
      height="16"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 300 300"
    >
      <path d="M178.57 127.15 290.27 0h-26.46l-97.03 110.38L89.34 0H0l117.13 166.93L0 300.25h26.46l102.4-116.59 81.8 116.59h89.34M36.01 19.54H76.66l187.13 262.13h-40.66" />
    </svg>
  );
};

const TelegramIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="16"
      viewBox="0 0 20 16"
      fill="none"
    >
      <path
        d="M19.7398 1.45657L16.8608 15.0342C16.6436 15.9924 16.0771 16.2309 15.2721 15.7796L10.8854 12.5469L8.76879 14.5828C8.53463 14.817 8.33866 15.0129 7.8872 15.0129L8.20233 10.5452L16.3327 3.19847C16.6862 2.88334 16.256 2.70869 15.7833 3.02386L5.73217 9.35266L1.40507 7.99835C0.463838 7.70445 0.446834 7.05707 1.60095 6.60566L18.526 0.085202C19.3096 -0.208647 19.9954 0.25977 19.7398 1.45657Z"
        fill="#151515"
      />
    </svg>
  );
};

const YoutubeIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="16"
      viewBox="0 0 24 16"
      fill="none"
    >
      <path
        d="M23.1744 2.49854C22.9115 1.51517 22.1369 0.740571 21.1535 0.477714C19.3712 -1.21102e-07 12.2235 0 12.2235 0C12.2235 0 5.07581 -1.21102e-07 3.29346 0.477714C2.3101 0.740571 1.53549 1.51517 1.27264 2.49854C0.794922 4.28089 0.794922 8 0.794922 8C0.794922 8 0.794922 11.7191 1.27264 13.5015C1.53549 14.4848 2.3101 15.2594 3.29346 15.5223C5.07581 16 12.2235 16 12.2235 16C12.2235 16 19.3712 16 21.1535 15.5223C22.1369 15.2594 22.9115 14.4848 23.1744 13.5015C23.6521 11.7191 23.6521 8 23.6521 8C23.6521 8 23.6521 4.28089 23.1744 2.49854ZM9.93778 11.4286V4.57143L15.8761 8L9.93778 11.4286Z"
        fill="#151515"
      />
    </svg>
  );
};

const MidContent = () => {
  return (
    <>
      <MidContainer>
        <Title>/dev/hub newsletter</Title>
        <Description>
          Stay in the loop. Get the latest updates, announcements,
          <br />
          opportunities, and insights from the ecosystem in your inbox.
        </Description>
        <CTA href="https://newsletter.neardevhub.org" target="no_blank">
          Subscribe
        </CTA>
        <SocialLinks>
          <a href="https://twitter.com/NEARDevHub" target="_blank">
            <XIcon />
          </a>
          <a href="https://t.me/NEARDevHub" target="_blank">
            <TelegramIcon />
          </a>
          <a href="https://www.youtube.com/@NEARDevHub" target="_blank">
            <YoutubeIcon />
          </a>
        </SocialLinks>
      </MidContainer>
    </>
  );
};

const SocialLinksContainer = () => {
  return (
    <div className="d-flex gap-md-4 gap-2 align-items-center">
      <a href="https://twitter.com/NEARDevHub" target="_blank">
        <XIcon />
      </a>
      <a href="https://t.me/NEARDevHub" target="_blank">
        <TelegramIcon />
      </a>
      <a href="https://www.youtube.com/@NEARDevHub" target="_blank">
        <YoutubeIcon />
      </a>
    </div>
  );
};

return (
  <Footer className="d-flex gap-2 justify-content-between">
    <SocialLinksContainer />
    <div className="d-flex align-items-center gap-3">
      <h6 className="m-0">Subscribe to our newsletter</h6>
      <CTA href="https://newsletter.neardevhub.org" target="no_blank">
        Subscribe
      </CTA>
    </div>
  </Footer>
);
