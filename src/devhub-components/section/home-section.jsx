const title = props.title;
const description = props.description;
const children = props.children;
const background = props.background;

const Section = styled.div`
  ${background && "background: #292929;"}
  ${background && "color: #F4F4F4;"}
`;

const SectionHeader = styled.h2`
  color: #00ec97;
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 400;
  line-height: 120%; /* 28.8px */
  letter-spacing: -0.24px;
`;

const SectionDescription = styled.h3`
  color: #151515;
  font-size: 2.25rem;
  font-style: normal;
  font-weight: 700;
  line-height: 110%; /* 39.6px */
  letter-spacing: -0.72px;

  margin-bottom: 3rem;
  margin-top: 3rem;

  max-width: 40rem;
`;

const Container = styled.div`
  padding: 3rem;
  padding-bottom: 0;
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
