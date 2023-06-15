// This component implementation was forked from [IndexFeed], but it does not fully implement lazy loading.
// While this component uses InfiniteScroll, it still loads the whole list of Post IDs in one view call.
// The contract will need to be extended with pagination support, yet, even in the current state the page loads much faster.
// [IndexFeed]: https://near.social/#/mob.near/widget/WidgetSource?src=mob.near/widget/IndexFeed

/* INCLUDE: "common.jsx" */
const nearDevGovGigsContractAccountId =
  props.nearDevGovGigsContractAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];

const nearDevGovGigsWidgetsAccountId =
  props.nearDevGovGigsWidgetsAccountId ||
  // (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];
  (context.widgetSrc ?? "jgdev.near").split("/", 1)[0];

function widget(widgetName, widgetProps, key) {
  widgetProps = {
    ...widgetProps,
    nearDevGovGigsContractAccountId: props.nearDevGovGigsContractAccountId,
    nearDevGovGigsWidgetsAccountId: props.nearDevGovGigsWidgetsAccountId,
    referral: props.referral,
  };

  return (
    <Widget
      src={`${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.${widgetName}`}
      props={widgetProps}
      key={key}
    />
  );
}

function href(widgetName, linkProps) {
  linkProps = { ...linkProps };

  if (props.nearDevGovGigsContractAccountId) {
    linkProps.nearDevGovGigsContractAccountId =
      props.nearDevGovGigsContractAccountId;
  }

  if (props.nearDevGovGigsWidgetsAccountId) {
    linkProps.nearDevGovGigsWidgetsAccountId =
      props.nearDevGovGigsWidgetsAccountId;
  }

  if (props.referral) {
    linkProps.referral = props.referral;
  }

  const linkPropsQuery = Object.entries(linkProps)
    .filter(([_key, nullable]) => (nullable ?? null) !== null)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return `/#/${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.pages.${widgetName}${
    linkPropsQuery ? "?" : ""
  }${linkPropsQuery}`;
}
/* END_INCLUDE: "common.jsx" */

initState({
  period: "week",
});

function defaultRenderItem(postId, additionalProps) {
  if (!additionalProps) {
    additionalProps = {};
  }
  // It is important to have a non-zero-height element as otherwise InfiniteScroll loads too many items on initial load
  return (
    <div style={{ minHeight: "150px" }}>
      {widget(
        `components.posts.Post`,
        {
          id: postId,
          expandable: true,
          defaultExpanded: false,
          isInList: true,
          ...additionalProps,
        },
        postId
      )}
    </div>
  );
}

const renderItem = props.renderItem ?? defaultRenderItem;

const cachedRenderItem = (item, i) => {
  if (props.searchResult && props.searchResult.keywords[item]) {
    return renderItem(item, {
      searchKeywords: props.searchResult.keywords[item],
    });
  }

  const key = JSON.stringify(item);

  if (!(key in state.cachedItems)) {
    state.cachedItems[key] = renderItem(item);
    State.update();
  }
  return state.cachedItems[key];
};

const initialRenderLimit = props.initialRenderLimit ?? 3;
const addDisplayCount = props.nextLimit ?? initialRenderLimit;

function getPostsByLabel() {
  let postIds = Near.view(
    nearDevGovGigsContractAccountId,
    "get_posts_by_label",
    {
      label: props.label,
    }
  );
  if (postIds) {
    postIds.reverse();
  }
  return postIds;
}

function getPostsByAuthor() {
  let postIds = Near.view(
    nearDevGovGigsContractAccountId,
    "get_posts_by_author",
    {
      author: props.author,
    }
  );
  if (postIds) {
    postIds.reverse();
  }
  return postIds;
}

function intersectPostsWithLabel(postIds) {
  if (props.label) {
    let postIdLabels = getPostsByLabel();
    if (postIdLabels === null) {
      // wait until postIdLabels are loaded
      return null;
    }
    postIdLabels = new Set(postIdLabels);
    return postIds.filter((id) => postIdLabels.has(id));
  }
  return postIds;
}

function intersectPostsWithAuthor(postIds) {
  if (props.author) {
    let postIdsByAuthor = getPostsByAuthor();
    if (postIdsByAuthor == null) {
      // wait until postIdsByAuthor are loaded
      return null;
    } else {
      postIdsByAuthor = new Set(postIdsByAuthor);
      return postIds.filter((id) => postIdsByAuthor.has(id));
    }
  }
  return postIds;
}

const ONE_DAY = 60 * 60 * 24 * 1000;
const ONE_WEEK = 60 * 60 * 24 * 1000 * 7;
const ONE_MONTH = 60 * 60 * 24 * 1000 * 30;

function getHotnessScore(post) {
  //post.id - shows the age of the post, should grow exponentially, since newer posts are more important
  //post.likes.length - linear value
  const age = Math.pow(post.id, 5);
  const comments = post.comments;
  const commentAge = comments.reduce((sum, age) => sum + Math.pow(age, 5), 0);
  const totalAge = age + commentAge;
  //use log functions to make likes score and exponentially big age score close to each other
  return Math.log10(post.likes.length) + Math.log(Math.log10(totalAge));
}

const getPeriodText = (period) => {
  let text = "Last 24 hours";
  if (period === "week") {
    text = "Last week";
  }
  if (period === "month") {
    text = "Last month";
  }
  return text;
};

const findHottestsPosts = (postIds, period) => {
  let allPosts;
  if (!state.allPosts) {
    allPosts = Near.view("devgovgigs.near", "get_posts");
    if (!allPosts) {
      return [];
    }
    State.update({ allPosts });
  } else {
    allPosts = state.allPosts;
  }
  let postIdsSet = new Set(postIds);
  let posts = allPosts.filter((post) => postIdsSet.has(post.id));

  let periodTime = ONE_DAY;
  if (period === "week") {
    periodTime = ONE_WEEK;
  }
  if (period === "month") {
    periodTime = ONE_MONTH;
  }
  const periodLimitedPosts = posts.filter((post) => {
    const timestamp = post.snapshot.timestamp / 1000000;
    return Date.now() - timestamp < periodTime;
  });
  const modifiedPosts = periodLimitedPosts.map((post) => {
    const comments =
      Near.view("devgovgigs.near", "get_children_ids", {
        post_id: post.id,
      }) || [];
    post = { ...post, comments };
    return {
      ...post,
      postScore: getHotnessScore(post),
    };
  });
  modifiedPosts.sort((a, b) => b.postScore - a.postScore);
  return modifiedPosts.map((post) => post.id);
};

let postIds;
if (props.searchResult) {
  postIds = props.searchResult.postIds;
  postIds = intersectPostsWithLabel(postIds);
  postIds = intersectPostsWithAuthor(postIds);
} else if (props.label) {
  postIds = getPostsByLabel();
  postIds = intersectPostsWithAuthor(postIds);
} else if (props.author) {
  postIds = getPostsByAuthor();
} else if (props.recency == "all") {
  postIds = Near.view(nearDevGovGigsContractAccountId, "get_all_post_ids");
  if (postIds) {
    postIds.reverse();
  }
} else {
  postIds = Near.view(nearDevGovGigsContractAccountId, "get_children_ids");
  if (postIds) {
    postIds.reverse();
  }
}

if (props.recency == "hot") {
  postIds = findHottestsPosts(postIds, state.period);
}

const loader = (
  <div className="loader" key={"loader"}>
    <span
      className="spinner-grow spinner-grow-sm me-1"
      role="status"
      aria-hidden="true"
    />
    Loading ...
  </div>
);

if (postIds === null) {
  return loader;
}
const initialItems = postIds;
//const initialItems = postIds.map(postId => ({ id: postId, ...Near.view(nearDevGovGigsContractAccountId, "get_post", { post_id: postId }) }));

// const computeFetchFrom = (items, limit) => {
//   if (!items || items.length < limit) {
//     return false;
//   }
//   const blockHeight = items[items.length - 1].blockHeight;
//   return index.options.order === "desc" ? blockHeight - 1 : blockHeight + 1;
// };

// const mergeItems = (newItems) => {
//   const items = [
//     ...new Set([...newItems, ...state.items].map((i) => JSON.stringify(i))),
//   ].map((i) => JSON.parse(i));
//   items.sort((a, b) => a.blockHeight - b.blockHeight);
//   if (index.options.order === "desc") {
//     items.reverse();
//   }
//   return items;
// };

const jInitialItems = JSON.stringify(initialItems);
if (state.jInitialItems !== jInitialItems) {
  // const jIndex = JSON.stringify(index);
  // if (jIndex !== state.jIndex) {
  State.update({
    jIndex,
    jInitialItems,
    items: initialItems,
    fetchFrom: false,
    //nextFetchFrom: computeFetchFrom(initialItems, index.options.limit),
    nextFetchFrom: false,
    displayCount: initialRenderLimit,
    cachedItems: {},
  });
  // } else {
  //   State.update({
  //     jInitialItems,
  //     items: mergeItems(initialItems),
  //   });
  // }
}

if (state.fetchFrom) {
  console.log("TODO: fetchFrom");
  // const limit = addDisplayCount;
  // const newItems = Social.index(
  //   index.action,
  //   index.key,
  //   Object.assign({}, index.options, {
  //     from: state.fetchFrom,
  //     subscribe: undefined,
  //     limit,
  //   })
  // );
  // if (newItems !== null) {
  //   State.update({
  //     items: mergeItems(newItems),
  //     fetchFrom: false,
  //     nextFetchFrom: computeFetchFrom(newItems, limit),
  //   });
  // }
}

const makeMoreItems = () => {
  State.update({
    displayCount: state.displayCount + addDisplayCount,
  });
  if (
    state.items.length - state.displayCount < addDisplayCount * 2 &&
    !state.fetchFrom &&
    state.nextFetchFrom &&
    state.nextFetchFrom !== state.fetchFrom
  ) {
    State.update({
      fetchFrom: state.nextFetchFrom,
    });
  }
};

const fetchMore =
  props.manual &&
  (state.fetchFrom && state.items.length < state.displayCount
    ? loader
    : state.displayCount < state.items.length && (
        <div key={"loader more"}>
          <a href="javascript:void" onClick={(e) => makeMoreItems()}>
            {props.loadMoreText ?? "Load more..."}
          </a>
        </div>
      ));

const items = state.items ? state.items.slice(0, state.displayCount) : [];

console.log(items);
const renderedItems = items.map(cachedRenderItem);

const Head =
  props.recency == "hot" ? (
    <div class="row">
      <div class="fs-5 col-6 align-self-center">
        <i class="bi-fire"></i>
        <span>Hottest Posts</span>
      </div>
      <div class="col-6 dropdown d-flex justify-content-end">
        <a
          class="btn btn-secondary dropdown-toggle"
          href="#"
          role="button"
          id="dropdownMenuLink"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {getPeriodText(state.period)}
        </a>

        <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
          <li>
            <button
              class="dropdown-item"
              onClick={() => {
                State.update({ period: "day" });
              }}
            >
              {getPeriodText("day")}
            </button>
          </li>
          <li>
            <button
              class="dropdown-item"
              onClick={() => {
                State.update({ period: "week" });
              }}
            >
              {getPeriodText("week")}
            </button>
          </li>
          <li>
            <button
              class="dropdown-item"
              onClick={() => {
                State.update({ period: "month" });
              }}
            >
              {getPeriodText("month")}
            </button>
          </li>
        </ul>
      </div>
    </div>
  ) : (
    <></>
  );

return (
  <>
    {Head}
    {state.items.length > 0 ? (
      <InfiniteScroll
        pageStart={0}
        loadMore={makeMoreItems}
        hasMore={state.displayCount < state.items.length}
        loader={loader}
      >
        {renderedItems}
      </InfiniteScroll>
    ) : (
      <p class="text-secondary">
        No posts {props.searchResult ? "matches search" : ""}
        {props.recency == "hot"
          ? " in " + getPeriodText(state.period).toLowerCase()
          : ""}
      </p>
    )}
  </>
);
