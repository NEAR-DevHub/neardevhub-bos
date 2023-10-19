const title = props.title;
const desciption = props.desciption;
const children = props.children;
const background = props.background;

const Section = styled.div`
  ${background && "background: #292929;"}
  ${background && "color: #F4F4F4;"}
`;

const SectionHeader = styled.h2`
  color: #00ec97;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 120%; /* 28.8px */
  letter-spacing: -0.24px;
`;

const SectionDescription = styled.h3`
  color: #151515;
  font-size: 36px;
  font-style: normal;
  font-weight: 700;
  line-height: 110%; /* 39.6px */
  letter-spacing: -0.72px;

  margin-bottom: 48px;
  margin-top: 48px;

  max-width: 640px;
`;

return (
  <Section>
    <div style={{ padding: 48, paddingBottom: 0 }}>
      <SectionHeader>{title}</SectionHeader>
      {desciption && <SectionDescription>{desciption}</SectionDescription>}
    </div>
    {children}
  </Section>
);
