function Card({ data }) {
  const { category, title, subtitle, date } = data;

  const Container = styled.div`
    min-height: 12.5rem;
    display: flex;
    padding: 1rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    flex-shrink: 0;

    border-radius: 1rem;
    border: 1px solid rgba(129, 129, 129, 0.3);
    background: #fffefe;

    h5 {
      margin: 0;
      color: #151515;
      font-size: 1.5rem;
      font-style: normal;
      font-weight: 700;
      line-height: 110%; /* 39.6px */
    }

    ${category &&
    `
    span.category {
      color: ${
        category.toLowerCase() === "news"
          ? "#F40303"
          : category.toLowerCase() === "guide"
          ? "#004BE1"
          : category.toLowerCase() === "reference" && "#FF7A00"
      };
      font-size: 1rem;
      font-style: normal;
      font-weight: 700;
      line-height: 20px; /* 125% */
      text-transform: uppercase;
    }
    `}

    span.date {
      color: #818181;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px; /* 125% */
    }

    p {
      margin: 0;
      color: #151515;
      font-size: 1rem;
      font-style: normal;
      font-weight: 400;
      line-height: 120%; /* 28.8px */
    }
  `;

  const options = { year: "numeric", month: "short", day: "numeric" };
  const formattedDate = new Date(date).toLocaleString("en-US", options);

  return (
    <Container id={`blog-card-${title}`}>
      {category && <span className="category">{category}</span>}
      <h5>{title}</h5>
      <p>{subtitle}</p>
      <span className="date">{formattedDate}</span>
    </Container>
  );
}

return { Card };
