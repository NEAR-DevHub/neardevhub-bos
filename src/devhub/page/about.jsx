const PageHeader = styled.h2`
  color: #04a46e;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 120%; /* 28.8px */
  letter-spacing: -0.24px;

  width: 100%;
  padding: 1rem 3.125rem;
  margin-left: auto;
  //background: #fff;

  margin-top: 1.5rem;
  margin-bottom: 1.5rem;

  @media screen and (max-width: 786px) {
    padding: 1rem;
  }
`;

const Section = styled.div`
  padding: 1.5rem 8rem;
  display: flex;
  flex-direction: column;

  display: flex;
  flex-direction: column;

  gap: 2rem;

  @media screen and (max-width: 786px) {
    padding: 1rem;
  }

  h2 {
    color: #151515;
    font-size: 2rem;
    font-style: normal;
    font-weight: 700;
    line-height: 2rem; /* 55.556% */

    margin: 1rem;
    margin-left: 0;
  }

  p {
    color: #151515;
    font-size: 1.25rem;
    font-style: normal;
    font-weight: 400;
    line-height: 120%; /* 28.8px */
    margin-bottom: 1rem;
  }

  h3 {
    color: #151515;
    font-size: 1.5rem;
    font-style: normal;
    font-weight: 700;
    line-height: 120%;

    margin-top: 1rem;
  }
`;

return (
  <>
    <Widget
      src={`${REPL_DEVHUB}/widget/devhub.components.island.banner`}
      props={{
        title: (
          <>
            We are building <br />
            <span style={{ color: "#151515" }}>
              a decentralized community
            </span>{" "}
            <br />
            for NEAR Developers.
          </>
        ),
        imageLink:
          "https://ipfs.near.social/ipfs/bafkreigtpjmgt3aphd3plbcremtvazeo7qsjvguw44m74zthyxbhj4toqe",
      }}
    />
    <PageHeader>About /dev/hub</PageHeader>
    <Section>
      <h2>
        What is <span style={{ color: "#00EC97" }}>near</span>/dev/hub?
      </h2>

      <div>
        <p>
          DevHub caters to a niche audience of open-source developers motivated
          by technology and a strong sense of community. They are driven by
          personal goals and the desire to contribute to the common good and
          actively participate in the NEAR community. What keeps them engaged is
          the recognition, empowerment, success of fellow community members,
          innovation, and the sense of technological progress. See NEAR Tech
          Audience mindmap above for more
        </p>

        <h3>Value Proposition:</h3>
        <p>
          DevHub's unique value proposition lies in its ability to foster
          innovation for projects that contribute to the common good. It
          empowers developers by creating a peer-to-peer support structure that
          enables them to make a meaningful impact within the decentralized NEAR
          community.
        </p>

        <h3>Competitive Edge:</h3>
        <p>
          DevHub distinguishes itself by being a decentralized, fair, and
          predictable platform where projects and brands are part of the
          decision-making and execution process. It operates at a high velocity,
          ensuring that results are consistently delivered. This sets it apart
          from other open-source communities, which often lack the same level of
          organization and predictability.
        </p>

        <h3>Emotional Appeal:</h3>
        <p>
          DevHub aims to evoke feelings of respect, fairness, and predictability
          in its users. It strives to create a balance between being a
          structured platform and maintaining a sense of socialness and fun
          within the community.
        </p>

        <h3>Visual Identity:</h3>
        <p>
          The visual identity should reinforce the emotions of respect,
          fairness, and predictability while maintaining a sense of socialness
          and fun. It should be highly recognisable, with a consistent colour
          scheme and design elements that can be integrated into other
          applications and websites.
        </p>

        <h3>Immediate Brand Recognition:</h3>
        <p>
          DevHub's goal is for "DevHub" to be the immediate answer for anyone
          seeking assistance or information related to the NEAR ecosystem,
          whether it's about code or social events. The brand should convey that
          it is a reliable, fair, and respectful resource within the NEAR
          community.
        </p>

        <h3>Relation to NEAR:</h3>
        <p>
          DevHub is closely tied to NEAR and plays a critical role in supporting
          and growing the ecosystem. While it should be communicated that DevHub
          is related to NEAR, it should also maintain its distinct brand
          identity.
        </p>
      </div>
    </Section>
  </>
);
