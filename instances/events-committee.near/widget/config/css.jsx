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
`;

return { CssContainer };
