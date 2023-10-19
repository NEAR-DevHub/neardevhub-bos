State.init({
  startIndex: 0,
  endIndex: 2,
});

const DescriptionHeader = styled.h2`
  color: #f4f4f4;
  font-size: 28px;
  font-style: normal;
  font-weight: 700;
  line-height: 120%; /* 43.2px */
`;

const Description = styled.p`
  color: #f4f4f4;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 120%; /* 28.8px */
`;

const imageSource =
  "https://s3-alpha-sig.figma.com/img/3b54/e4fa/1508a7cf222faf5f331f489d224e4fd6?Expires=1698624000&Signature=gIhYLppLobWi6QMrBzxH-SQFd5JGKJrah~PHlxUYgOOoYPxOTTQ9qOEB8xqHX8pGuaJqTre7Fn~FdI~jWK0WdPrvev8OJDIKWF1zSLSLYG20ztuMR8K8hu4~N1k-Fomyp34H6GalsbWM6p~J5QS0G5L-Wkc2am24-Ys8c4BwqH-CdPAvehTNxgwgGq77aLkf1HqfRaUW5uLcLBhzOavk03lXSxSTmUo5KZX5SOxYTpktmLozASkkFR4-SAVQkxEwlN8s3JG8eX7dsUohsfiE-jYFjuKxfwU~f0OfyvNCvdyvEg335qIMRvD5NCrmQTnm0ZJRxOX~imYi6GV74U8p8w__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4";

const CardBody = styled.div`
  border-radius: 16px;
  border: 1px solid #00ec97;
  background: #3f4040;

  display: flex;
  max-width: 31.5%;
  padding: 24px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 24px;
  flex-shrink: 0;
  align-self: stretch;

  h3 {
    color: #00ec97;
    font-size: 32px;
    font-style: normal;
    font-weight: 700;
    line-height: 100%; /* 40px */
  }

  p {
    color: #818181;
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: 120%; /* 28.8px */
  }

  a {
    color: #00ec97;
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: 120%; /* 28.8px */

    &:hover {
      text-decoration: none;
    }
  }
`;

const Card = ({ title, description, cta }) => {
  return (
    <CardBody>
      <h3>{title}</h3>
      <p>{description}</p>
      <a href={cta}>Learn more →</a>
    </CardBody>
  );
};

const Cards = [
  {
    title: "/dev/hub Hacks",
    description: "Host and support developer focused events around the globe.",
    href: "#",
  },
  {
    title: "DevDAO Fellowship Program",
    description: "Improve the NEAR dev experience with guidance & funding.",
    href: "#",
  },
  {
    title: "Protocol",
    description: "Support the ongoing innovation of the NEAR protocol.",
    href: "#",
  },
  {
    title: "Featured Community 4",
    description: "Host and support developer focused events around the globe.",
    href: "#",
  },
  {
    title: "Featured Community 5",
    description: "Host and support developer focused events around the globe.",
    href: "#",
  },
];

const ForwardButton = styled.button`
  all: unset;

  margin: 1rem;

  &:hover,
  &:active {
    border: none;
    outline: none;
  }

  ${state.endIndex >= Cards.length - 1 && "svg {transform: rotate(180deg);}"}
`;

const handleForward = () => {
  if (state.endIndex <= Cards.length - 1) {
    State.update({
      startIndex: state.endIndex + 1,
      endIndex: state.endIndex + 3,
    });
  } else {
    State.update({
      startIndex: 0,
      endIndex: 2,
    });
  }
};

const CTA = styled.a`
  color: #00ec97;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 120%; /* 28.8px */
`;

const Subheading = styled.h3`
  color: #8a8e93;
  font-size: 36px;
  font-style: normal;
  font-weight: 700;
  line-height: 120%; /* 43.2px */

  padding: 48px;
  padding-top: 0;
`;

const Content = (
  <>
    <div className="w-100 d-flex position-relative align-items-center">
      <div style={{ padding: 48, width: "60%" }}>
        <DescriptionHeader>
          Communities are the lifeblood of /dev/hub
        </DescriptionHeader>
        <Description>
          We believe that communities are the foundation of a decentralized
          ecosystem. Explore and engage with our diverse range of communities
          today.
        </Description>
      </div>
      <div
        className="position-absolute top-25 end-0"
        style={{ width: "50%", height: "65%" }}
      >
        <img
          src={imageSource}
          style={{
            width: "100%",
            height: "90%",
            objectFit: "cover",
            clipPath: "polygon(15% 0, 100% 0%, 100% 100%, 0% 100%)",
            objectPosition: "center top",
          }}
        />
      </div>
    </div>
    <Subheading>Featured Communities</Subheading>
    <div
      style={{ padding: 48, paddingTop: 0 }}
      className="position-relative d-flex flex-row gap-3 w-100 align-items-center justify-content-center"
    >
      {Cards.slice(state.startIndex, state.endIndex + 1).map((card, idx) => (
        <Card
          title={card.title}
          description={card.description}
          href={card.href}
          key={`project-card-${idx}`}
        />
      ))}
      <ForwardButton
        className="position-absolute end-0"
        onClick={handleForward}
      >
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
      </ForwardButton>
    </div>
    <div style={{ padding: 48, paddingTop: 0 }}>
      <CTA href="#">Explore all communities →</CTA>
    </div>
  </>
);

return (
  <Widget
    src="devhub.testnet/widget/home.components.Section.HomeSection"
    props={{
      title: "/connect",
      children: Content,
      background: true,
    }}
  />
);
