/**
 * Reads a board config from DevHub contract storage.
 * Currently a mock.
 *
 * Boards are indexed by their ids.
 */
const boardConfigByBoardId = ({ boardId }) => ({
  id: boardId,

  columns: {
    [uuid()]: {
      description: "Lorem ipsum",
      labelTerms: ["S-draft"],
      title: "Draft",
    },

    [uuid()]: {
      description: "Dolor sit",
      labelTerms: ["S-review"],
      title: "Review",
    },
  },

  dataTypes: { Issue: true, PullRequest: true },
  description: "Latest NEAR Enhancement Proposals by status",
  repoURL: "https://github.com/near/NEPs",
  title: "NEAR Protocol NEPs",
});
