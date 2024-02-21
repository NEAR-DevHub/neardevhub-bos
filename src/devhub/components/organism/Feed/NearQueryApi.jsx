const LIMIT = 10;
const filteredAccountIds = props.filteredAccountIds;
const setPostExists = props.setPostExists ?? (() => {});
const GRAPHQL_ENDPOINT =
  props.GRAPHQL_ENDPOINT ?? "https://near-queryapi.api.pagoda.co";

const sort = props.sort || "timedec";

// get the full list of posts that the current user has flagged so
// they can be hidden
const selfFlaggedPosts = context.accountId
  ? Social.index("flag", "main", {
      accountId: context.accountId,
    }) ?? []
  : [];

// V2 self moderation data, structure is like:
// { moderate: {
//     "account1.near": "report",
//     "account2.near": {
//         ".post.main": { // slashes are not allowed in keys
//           "100000123": "spam", // post ids are account/blockHeight
//         }
//     },
//   }
// }
const selfModeration = context.accountId
  ? Social.getr(`${context.accountId}/moderate`, "optimistic") ?? []
  : [];
const postsModerationKey = ".post.main";
const commentsModerationKey = ".post.comment";
const matchesModeration = (moderated, socialDBObjectType, item) => {
  if (!moderated) return false;
  const accountFound = moderated[item.account_id];
  if (typeof accountFound === "undefined") {
    return false;
  }
  if (typeof accountFound === "string" || accountFound[""]) {
    return true;
  }
  const moderatedItemsOfType = accountFound[socialDBObjectType];
  return (
    moderatedItemsOfType &&
    typeof moderatedItemsOfType[item.block_height] !== "undefined"
  );
};

const shouldFilter = (item, socialDBObjectType) => {
  return (
    selfFlaggedPosts.find((flagged) => {
      return (
        flagged?.value?.blockHeight === item.block_height &&
        flagged?.value?.path.includes(item.account_id)
      );
    }) || matchesModeration(selfModeration, socialDBObjectType, item)
  );
};
function fetchGraphQL(operationsDoc, operationName, variables) {
  return asyncFetch(`${GRAPHQL_ENDPOINT}/v1/graphql`, {
    method: "POST",
    headers: { "x-hasura-role": "dataplatform_near" },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });
}

const createQuery = (type, isUpdate) => {
  let querySortOption = "";
  switch (sort) {
    case "recentcommentdesc":
      querySortOption = `{ last_comment_timestamp: desc_nulls_last },`;
      break;
    default:
      querySortOption = "";
  }

  let queryFilter = "";
  let timeOperation = "_lte";
  if (isUpdate) {
    timeOperation = "_gt";
  }

  const queryTime = initialQueryTime ? initialQueryTime : Date.now() * 1000000;

  if (filteredAccountIds) {
    queryFilter = `where: {
          _and: [
            {account_id: {_in: "${filteredAccountIds}"}},
            {block_timestamp: {${timeOperation}: ${queryTime}}}
          ]
        }, `;
  } else {
    queryFilter = `where: {
          _and: [
            {block_timestamp: {${timeOperation}: ${queryTime}}}
          ]
        }, `;
  }

  return `
query FeedQuery($offset: Int, $limit: Int) {
  dataplatform_near_social_feed_moderated_posts(${queryFilter} order_by: [${querySortOption} { block_height: desc }], offset: $offset, limit: $limit) {
    account_id
    block_height
    block_timestamp
    content
    receipt_id
    accounts_liked
    last_comment_timestamp
    comments(order_by: {block_height: asc}) {
      account_id
      block_height
      block_timestamp
      content
    }
    verifications {
      human_provider
      human_valid_until
      human_verification_level
    }

  }
  dataplatform_near_social_feed_moderated_posts_aggregate(${queryFilter} order_by: {id: asc}) {
    aggregate {
      count
    }
  }
}
`;
};

const loadMorePosts = (isUpdate) => {
  const queryName = "FeedQuery";

  if (!isUpdate) {
    setIsLoading(true);
  }
  const offset = isUpdate ? 0 : postsData.posts.length;
  const limit = isUpdate ? 100 : LIMIT;
  const query = createQuery("", isUpdate);
  fetchGraphQL(query, queryName, {
    offset: offset,
    limit: limit,
  }).then((result) => {
    if (result.status === 200 && result.body) {
      if (result.body.errors) {
        console.log("error:", result.body.errors);
        return;
      }
      let data = result.body.data;
      if (data) {
        const newPosts = data.dataplatform_near_social_feed_moderated_posts;
        const postsCountLeft =
          data.dataplatform_near_social_feed_moderated_posts_aggregate.aggregate
            .count;
        if (newPosts.length > 0) {
          let filteredPosts = newPosts.filter(
            (i) => !shouldFilter(i, postsModerationKey)
          );
          filteredPosts = filteredPosts.map((post) => {
            const prevComments = post.comments;
            const filteredComments = prevComments.filter(
              (comment) => !shouldFilter(comment, commentsModerationKey)
            );
            post.comments = filteredComments;
            return post;
          });

          if (isUpdate) {
            setNewUnseenPosts(filteredPosts);
          } else {
            setPostsData({
              posts: [...postsData.posts, ...filteredPosts],
              postsCountLeft,
            });
            setIsLoading(false);
          }
        }
      }
    }
    if (!isUpdate && initialQueryTime === null) {
      const newTime =
        postsData.posts && postsData.posts[0]
          ? postsData.posts[0].block_timestamp
          : Date.now() * 1000000;
      setInitialQueryTime(newTime + 1000);
    }
  });
};

const displayNewPosts = () => {
  if (newUnseenPosts.length > 0) {
    stopFeedUpdates();
    const initialQueryTime = newUnseenPosts[0].block_timestamp + 1000; // timestamp is getting rounded by 3 digits
    const newTotalCount = postsData.postsCountLeft + newUnseenPosts.length;
    setPostsData({
      posts: [...newUnseenPosts, ...postsData.posts],
      postsCountLeft: newTotalCount,
    });
    setNewUnseenPosts([]);
    setInitialQueryTime(initialQueryTime);
  }
};
const startFeedUpdates = () => {
  if (initialQueryTime === null) return;

  clearInterval(feedInterval);
  const newFeedInterval = setInterval(() => {
    loadMorePosts(true);
  }, 5000);
  setFeedInterval(newFeedInterval);
};

const stopFeedUpdates = () => {
  clearInterval(feedInterval);
};

const [initialized, setInitialized] = useState(false);
const [initialQueryTime, setInitialQueryTime] = useState(null);
const [feedInterval, setFeedInterval] = useState(null);
const [newUnseenPosts, setNewUnseenPosts] = useState([]);
const [postsData, setPostsData] = useState({ posts: [], postsCountLeft: 0 });
const [isLoading, setIsLoading] = useState(false);

useEffect(() => {
  loadMorePosts(false);
}, []);

useEffect(() => {
  if (postsData.posts.length > 0) {
    setPostExists(true);
  }
}, [postsData]);

useEffect(() => {
  if (initialQueryTime === null) {
    clearInterval(feedInterval);
  } else {
    startFeedUpdates();
  }
}, [initialQueryTime]);

const hasMore =
  postsData.postsCountLeft !== postsData.posts.length &&
  postsData.posts.length > 0;

if (!initialized && sort) {
  setInitialized(true);
}

return (
  <>
    <Widget
      src="${REPL_NEAR}/widget/Posts.Feed"
      props={{
        hasMore,
        isLoading,
        loadMorePosts: () => {
          if (!isLoading) {
            loadMorePosts(false);
          }
        },
        posts: postsData.posts,
        showFlagAccountFeature: props.showFlagAccountFeature,
      }}
    />
  </>
);
