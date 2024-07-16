const title = props.title;
const titleColor = props.titleColor;
const description = props.description;
const children = props.children;
const background = props.background;

const Section = styled.div`
  ${background && "background: #292929;"}
  ${background && "color: #F4F4F4;"}
  width: 100%;
`;

const SectionHeader = styled.h2`
  color: ${titleColor || "#00ec97"};
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 400;
  line-height: 120%; /* 28.8px */
  letter-spacing: -0.24px;

  @media screen and (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const SectionDescription = styled.h3`
  color: #151515;
  font-size: 2.25rem;
  font-style: normal;
  font-weight: 700;
  line-height: 110%; /* 39.6px */
  letter-spacing: -0.72px;

  margin-bottom: 2.25rem;
  margin-top: 2.25rem;

  max-width: 40rem;

  @media screen and (max-width: 768px) {
    margin-bottom: 1.5rem;
    margin-top: 1.5rem;
    font-size: 1.5rem;
  }
`;

const Container = styled.div`
  padding: 3rem;
  padding-bottom: 0;

  @media screen and (max-width: 768px) {
    padding: 1rem;
  }
`;

return (
  <Section>
    <Container>
      <SectionHeader>{title}</SectionHeader>
      {description && <SectionDescription>{description}</SectionDescription>}
    </Container>
    {children}
  </Section>
);
