const page = props.page;
const imageLink =
  "https://ipfs.near.social/ipfs/bafkreiatybj6g6i4b4azcu3zoutlcxobrzpg3k4taazhkyd7sk5tuwmb5q";

const Footer = styled.div`
  width: 100%;
  background-color: #00ec97;
  padding: 1.5rem;
`;

const Title = styled.h5`
  color: #151515;
  text-align: center;
  font-size: 1.75rem;
  font-style: normal;
  font-weight: 700;
  line-height: 120%; /* 43.2px */
  margin: 0;
`;

const Description = styled.p`
  color: #151515;
  text-align: center;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: 120%; /* 28.8px */
  letter-spacing: -0.72px;
  margin: 0;
`;

const MidContainer = styled.div`
  width: 720px;
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  ${(page === "community" || page === "communities" || page === "feed") &&
  "display: none;"}
`;

const CTA = styled.a`
  background: #151515;
  padding: 0.75rem 0.75rem;
  color: #00ec97 !important;
  font-size: 1rem;
  font-style: normal;
  font-weight: 700;
  line-height: 20px; /* 83.333% */
  &:hover {
    text-decoration: none;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
`;

const TwitterIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="16"
      viewBox="0 0 20 16"
      fill="none"
    >
      <path
        d="M19.7161 1.89418C19.0035 2.21575 18.2376 2.43232 17.4338 2.52994C18.2546 2.03035 18.8848 1.23872 19.181 0.295324C18.4136 0.757998 17.563 1.09434 16.6575 1.27564C15.9336 0.490566 14.8998 0 13.7571 0C11.1916 0 9.30636 2.43314 9.8858 4.95898C6.58429 4.79081 3.65643 3.18294 1.69618 0.73913C0.65513 2.55455 1.15629 4.92945 2.92527 6.13207C2.27481 6.11075 1.66148 5.92945 1.12643 5.62674C1.08285 7.49795 2.40232 9.24856 4.31334 9.63823C3.75408 9.79245 3.14155 9.82855 2.51853 9.70714C3.02373 11.3117 4.49088 12.4791 6.23081 12.5119C4.56029 13.8433 2.45559 14.4381 0.347656 14.1854C2.10615 15.3314 4.19552 16 6.43902 16C13.8168 16 17.985 9.66612 17.7332 3.98523C18.5096 3.41509 19.1834 2.70386 19.7161 1.89418Z"
        fill="#151515"
      />
    </svg>
  );
};

const XIcon = () => {
  return (
    <svg width="20" height="16" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
      <path d="M178.57 127.15 290.27 0h-26.46l-97.03 110.38L89.34 0H0l117.13 166.93L0 300.25h26.46l102.4-116.59 81.8 116.59h89.34M36.01 19.54H76.66l187.13 262.13h-40.66"/>
    </svg>
  )
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

const ImageContainer = styled.img`
  ${page !== "home" && "display: none;"}
  height: 280px;
  width: 100%;
  object-fit: cover;
`;

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
        <CTA href="#">Subscribe</CTA>
        <SocialLinks>
          <a href="https://twitter.com/neardevhub" target="_blank">
            <XIcon />
          </a>
          <a href="https://t.me/NEARDevGov" target="_blank">
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

const SmallContainer = styled.div`
  display: none;
  ${(page === "communities" || page === "community" || page === "feed") &&
  "display: flex !important;"}
  justify-content: space-between;
  align-items: center;
`;
const SmallContent = () => {
  return (
    <SmallContainer>
      <SocialLinks>
        <a href="#" target="_blank">
          <TwitterIcon />
        </a>
        <a href="#" target="_blank">
          <TelegramIcon />
        </a>
        <a href="#" target="_blank">
          <YoutubeIcon />
        </a>
      </SocialLinks>
      <div className="d-flex align-items-center gap-3">
        <h5 className="m-0">Subscribe to our newsletter</h5>
        <CTA href="#">Subscribe</CTA>
      </div>
      </SmallContainer>
  );
};

return (
  <>
    <ImageContainer src={imageLink} />
    <Footer>
      <MidContent />
      <SmallContent />
    </Footer>
  </>
);
