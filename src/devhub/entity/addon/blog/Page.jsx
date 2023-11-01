const imagelink =
  "https://ipfs.near.social/ipfs/bafkreiajzvmy7574k7mp3if6u53mdukfr3hoc2kjkhjadt6x56vqhd5swy";

function Page({ data }) {
  const { category, title, description, subtitle, date, content } = data;
  const Container = styled.div`
    display: flex;
    flex-direction: column;

    padding: 0 3rem;

    span.category {
      color: ${category.toLowerCase() === "news"
        ? "#F40303"
        : category.toLowerCase() === "guide"
        ? "#004BE1"
        : category.toLowerCase() === "reference" && "#FF7A00"};
      font-size: 1.5rem;
      font-style: normal;
      font-weight: 700;
      line-height: 20px; /* 125% */
      text-transform: uppercase;
    }

    span.date {
      color: #818181;
      font-size: 1rem;
      font-style: normal;
      font-weight: 400;
      line-height: 20px; /* 125% */
      margin: 1.5rem 0;
    }

    h1 {
      color: #151515;
      font-size: 3.5rem;
      font-style: normal;
      font-weight: 700;
      line-height: 100%; /* 88px */
      margin: 1rem 0;
    }

    p.subtitle {
      color: #555;
      font-size: 1.5rem;
      font-style: normal;
      font-weight: 400;
      line-height: 110%; /* 35.2px */
      margin: 0;
    }

    @media screen and (max-width: 768px) {
      padding: 0 1rem;

      span.category {
        font-size: 0.75rem;
      }

      h1 {
        font-size: 2rem;
      }

      p.subtitle {
        font-size: 1rem;
      }
    }
  `;

  const BackgroundImage = styled.img`
    width: 100%;
    height: auto;
    object-fit: cover;
    margin-bottom: 1rem;
  `;

  const options = { year: "numeric", month: "short", day: "numeric" };
  const formattedDate = new Date(date).toLocaleString("en-US", options);

  return (
    <>
      <BackgroundImage src={imagelink} />
      <Container>
        <span className="category">{category}</span>
        <h1>{title}</h1>
        <p className="subtitle">{subtitle}</p>
        <span className="date">{formattedDate}</span>
        <p>{description}</p>
        <Widget
          src="efiz.near/widget/every.markdown.view"
          props={{ data: { content: content } }}
        />
      </Container>
    </>
  );
}

return { Page };
