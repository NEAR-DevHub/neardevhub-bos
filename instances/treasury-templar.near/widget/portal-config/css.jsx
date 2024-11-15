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

  .bg-blue {
    background-image: linear-gradient(180deg, #355ec6, #963cdc);
    color: white;
  }
`;

return { CssContainer };
