const CssContainer = styled.div`
  .theme-btn {
    background-color: var(--theme-color) !important;
    border: none;
    color: white;

    &:active {
      color: white;
    }
  }

  a {
    color: inherit;
    text-decoration: inherit;
  }

  .attractable {
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
    transition: box-shadow 0.6s;

    &:hover {
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
    }
  }
`;

return { CssContainer };
