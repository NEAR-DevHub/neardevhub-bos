const Theme = styled.div`
  --theme-color: rgb(60, 105, 125);

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

  .bg-blue {
    background-image: linear-gradient(to bottom, #4b7a93, #213236);
    color: white;
  }
`;

return { Theme };
