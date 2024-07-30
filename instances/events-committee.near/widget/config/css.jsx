const Theme = styled.div`
  --theme-color: rgb(3, 186, 22);

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
  }
`;

return { Theme };
