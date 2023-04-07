/* INCLUDE: "common.jsx" */
const nearDevGovGigsContractAccountId =
  props.nearDevGovGigsContractAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];
const nearDevGovGigsWidgetsAccountId =
  props.nearDevGovGigsWidgetsAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];

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
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  return `#/${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.pages.${widgetName}${
    linkPropsQuery ? "?" : ""
  }${linkPropsQuery}`;
}
/* END_INCLUDE: "common.jsx" */

//////////////////////////////////////////////////////////////////////
///STOPWORDS//////////////////////////////////////////////////////////
const stopWords = [
  "about",
  "above",
  "after",
  "again",
  "against",
  "all",
  "and",
  "any",
  "are",
  "because",
  "been",
  "before",
  "being",
  "below",
  "between",
  "both",
  "but",
  "can",
  "cannot",
  "could",
  "did",
  "does",
  "doing",
  "down",
  "during",
  "each",
  "etc",
  "few",
  "for",
  "from",
  "further",
  "had",
  "has",
  "have",
  "having",
  "her",
  "hers",
  "herself",
  "him",
  "himself",
  "his",
  "how",
  "into",
  "its",
  "itself",
  "just",
  "more",
  "most",
  "myself",
  "nor",
  "not",
  "now",
  "off",
  "once",
  "only",
  "other",
  "our",
  "ours",
  "ourselves",
  "out",
  "over",
  "own",
  "same",
  "she",
  "should",
  "some",
  "still",
  "such",
  "than",
  "that",
  "the",
  "their",
  "theirs",
  "them",
  "themselves",
  "then",
  "there",
  "these",
  "they",
  "this",
  "those",
  "through",
  "too",
  "under",
  "until",
  "very",
  "was",
  "were",
  "what",
  "when",
  "where",
  "which",
  "while",
  "who",
  "whom",
  "why",
  "will",
  "with",
  "you",
  "your",
  "yours",
  "yourself",
  "yourselves",
  "www",
  "http",
  "com",
];

const stopWordsDictionary = {};
for (let i = 0; i < stopWords.length; i++) {
  stopWordsDictionary[stopWords[i]] = true;
}

function isStopWord(word) {
  return stopWordsDictionary.hasOwnProperty(word.toLowerCase());
}
//////////////////////////////////////////////////////////////////////
///SYNONYMS///////////////////////////////////////////////////////////
const synonyms = {
  ether: "ethereum",
  eth: "ethereum",
  either: "ethereum",
  app: "application",
  cryptocyrrency: "crypto",
  developerdao: "devdao",
  dev: "develop",
  doc: "document",
  lib: "librari",
  saw: "see",
  seen: "see",
  tweet: "twitter",
  paid: "pai",
  src: "sourc",
  zk: "zkp",
};

const applySynonym = (word) => {
  if (synonyms.hasOwnProperty(word.toLowerCase())) {
    return synonyms[word];
  }
  return word;
};
//////////////////////////////////////////////////////////////////////
///STEMMING///////////////////////////////////////////////////////////
const step2list = {
  ational: "ate",
  tional: "tion",
  enci: "ence",
  anci: "ance",
  izer: "ize",
  bli: "ble",
  alli: "al",
  entli: "ent",
  eli: "e",
  ousli: "ous",
  ization: "ize",
  ation: "ate",
  ator: "ate",
  alism: "al",
  iveness: "ive",
  fulness: "ful",
  ousness: "ous",
  aliti: "al",
  iviti: "ive",
  biliti: "ble",
  logi: "log",
};

/** @type {Record<string, string>} */
const step3list = {
  icate: "ic",
  ative: "",
  alize: "al",
  iciti: "ic",
  ical: "ic",
  ful: "",
  ness: "",
};

const gt0 = /^([^aeiou][^aeiouy]*)?([aeiouy][aeiou]*)([^aeiou][^aeiouy]*)/;
const eq1 =
  /^([^aeiou][^aeiouy]*)?([aeiouy][aeiou]*)([^aeiou][^aeiouy]*)([aeiouy][aeiou]*)?$/;
const gt1 =
  /^([^aeiou][^aeiouy]*)?(([aeiouy][aeiou]*)([^aeiou][^aeiouy]*)){2,}/;
const vowelInStem = /^([^aeiou][^aeiouy]*)?[aeiouy]/;
const consonantLike = /^([^aeiou][^aeiouy]*)[aeiouy][^aeiouwxy]$/;

// Exception expressions.
const sfxLl = /ll$/;
const sfxE = /^(.+?)e$/;
const sfxY = /^(.+?)y$/;
const sfxIon = /^(.+?(s|t))(ion)$/;
const sfxEdOrIng = /^(.+?)(ed|ing)$/;
const sfxAtOrBlOrIz = /(at|bl|iz)$/;
const sfxEED = /^(.+?)eed$/;
const sfxS = /^.+?[^s]s$/;
const sfxSsesOrIes = /^.+?(ss|i)es$/;
const sfxMultiConsonantLike = /([^aeiouylsz])\1$/;
const step2 =
  /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/;
const step3 = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;
const step4 =
  /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;

/**
 * Get the stem from a given value.
 *
 * @param {string} value
 *   Value to stem.
 * @returns {string}
 *   Stem for `value`
 */
// eslint-disable-next-line complexity
function stemmer(value) {
  let result = value.toLowerCase();

  // Exit early.
  if (result.length < 3) {
    return result;
  }

  /** @type {boolean} */
  let firstCharacterWasLowerCaseY = false;

  // Detect initial `y`, make sure it never matches.
  if (
    result.codePointAt(0) === 121 // Lowercase Y
  ) {
    firstCharacterWasLowerCaseY = true;
    result = "Y" + result.slice(1);
  }

  // Step 1a.
  if (sfxSsesOrIes.test(result)) {
    // Remove last two characters.
    result = result.slice(0, -2);
  } else if (sfxS.test(result)) {
    // Remove last character.
    result = result.slice(0, -1);
  }

  /** @type {RegExpMatchArray|null} */
  let match;

  // Step 1b.
  if ((match = sfxEED.exec(result))) {
    if (gt0.test(match[1])) {
      // Remove last character.
      result = result.slice(0, -1);
    }
  } else if ((match = sfxEdOrIng.exec(result)) && vowelInStem.test(match[1])) {
    result = match[1];

    if (sfxAtOrBlOrIz.test(result)) {
      // Append `e`.
      result += "e";
    } else if (sfxMultiConsonantLike.test(result)) {
      // Remove last character.
      result = result.slice(0, -1);
    } else if (consonantLike.test(result)) {
      // Append `e`.
      result += "e";
    }
  }

  // Step 1c.
  if ((match = sfxY.exec(result)) && vowelInStem.test(match[1])) {
    // Remove suffixing `y` and append `i`.
    result = match[1] + "i";
  }

  // Step 2.
  if ((match = step2.exec(result)) && gt0.test(match[1])) {
    result = match[1] + step2list[match[2]];
  }

  // Step 3.
  if ((match = step3.exec(result)) && gt0.test(match[1])) {
    result = match[1] + step3list[match[2]];
  }

  // Step 4.
  if ((match = step4.exec(result))) {
    if (gt1.test(match[1])) {
      result = match[1];
    }
  } else if ((match = sfxIon.exec(result)) && gt1.test(match[1])) {
    result = match[1];
  }

  // Step 5.
  if (
    (match = sfxE.exec(result)) &&
    (gt1.test(match[1]) ||
      (eq1.test(match[1]) && !consonantLike.test(match[1])))
  ) {
    result = match[1];
  }

  if (sfxLl.test(result) && gt1.test(result)) {
    result = result.slice(0, -1);
  }

  // Turn initial `Y` back to `y`.
  if (firstCharacterWasLowerCaseY) {
    result = "y" + result.slice(1);
  }

  return result;
}

//////////////////////////////////////////////////////////////////////
///SPELLCHECK/////////////////////////////////////////////////////////
function levenshteinDistance(s, t, threshold) {
  const BIG_NUMBER = 10000;
  if (s == null || t == null) {
    return BIG_NUMBER;
  }
  if (threshold < 0) {
    return BIG_NUMBER;
  }
  let n = s.length;
  let m = t.length;
  if (Math.abs(n - m) >= threshold) {
    return BIG_NUMBER;
  }

  // if one string is empty, the edit distance is necessarily the length of the other
  if (n == 0) {
    return m <= threshold ? m : BIG_NUMBER;
  } else if (m == 0) {
    return n <= threshold ? n : BIG_NUMBER;
  }

  if (n > m) {
    // swap the two strings to consume less memory
    let temp = s;
    s = t;
    t = temp;
    let tempSize = n;
    n = m;
    m = tempSize;
  }

  let p = Array.from({ length: n + 1 }, () => 0); // 'previous' cost array, horizontally
  let d = Array.from({ length: n + 1 }, () => 0); // cost array, horizontally
  let _d; // placeholder to assist in swapping p and d

  // fill in starting table values
  const boundary = Math.min(n, threshold) + 1;
  for (let i = 0; i < boundary; i++) {
    p[i] = i;
  }
  // these fills ensure that the value above the rightmost entry of our
  // stripe will be ignored in following loop iterations
  for (let i = boundary; i < p.length; i++) {
    p[i] = BIG_NUMBER;
  }
  for (let i = 0; i < d.length; i++) {
    d[i] = BIG_NUMBER;
  }

  // iterates through t
  for (let j = 1; j <= m; j++) {
    const t_j = t.charAt(j - 1); // jth character of t
    d[0] = j;

    // compute stripe indices, constrain to array size
    const min = Math.max(1, j - threshold);
    const max = j > BIG_NUMBER - threshold ? n : Math.min(n, j + threshold);

    // the stripe may lead off of the table if s and t are of different sizes
    if (min > max) {
      return BIG_NUMBER;
    }

    // ignore entry left of leftmost
    if (min > 1) {
      d[min - 1] = BIG_NUMBER;
    }

    // iterates through [min, max] in s
    for (let i = min; i <= max; i++) {
      if (s.charAt(i - 1) == t_j) {
        // diagonally left and up
        d[i] = p[i - 1];
      } else {
        // 1 + minimum of cell to the left, to the top, diagonally left and up
        d[i] = 1 + Math.min(Math.min(d[i - 1], p[i]), p[i - 1]);
      }
    }

    // copy current distance counts to 'previous row' distance counts
    _d = p;
    p = d;
    d = _d;
  }
  // we don't need to check for threshold here because we did it inside the loop
  return p[n] <= threshold ? p[n] : BIG_NUMBER;
}

const spellcheckQueryProcessing = (query, dictionary) => {
  // Split text document into words
  const words = stemAndFilterQuery(query);
  const dictionaryArray = Object.keys(dictionary);
  // Iterate over each word in the text
  for (let i = 0; i < words.length; i++) {
    let word = words[i].toLowerCase().replace(/[^a-z0-9]/g, "");

    // If the word is not in the dictionary, find the closest match
    if (!dictionary.hasOwnProperty(word)) {
      let closestMatch = undefined;
      let closestDistance = word.length;
      let allowedDistance = Math.min(word.length - 1, 3);
      // Iterate over each word in the dictionary
      if (word.length > 2) {
        for (let j = 0; j < dictionaryArray.length; j++) {
          let dictWord = dictionaryArray[j];
          let distance = levenshteinDistance(word, dictWord, allowedDistance);

          // If the distance is less than the closest distance, update the closest match
          if (distance <= allowedDistance && distance < closestDistance) {
            closestMatch = dictWord;
            closestDistance = distance;
          }
        }
      }
      // Replace the misspelled word with the closest match
      words[i] = closestMatch;
    }
  }
  return words.filter((word) => !!word);
};

//////////////////////////////////////////////////////////////////////
///INDEXER&SEARCH/////////////////////////////////////////////////////
const fillDictionaryWith = (dict, text, id) => {
  let word = "";
  for (let i = 0; i < text.length; i++) {
    const char = text.charAt(i);
    const nextChar = text.charAt(i + 1);
    if (/\w/.test(char) || (char === "." && /\w/.test(nextChar))) {
      word += char.toLowerCase();
    } else if (word.length > 0) {
      const processedWord = applySynonym(stemmer(word));
      if (processedWord.length > 2 && !isStopWord(processedWord)) {
        const oldValue = dict[processedWord] || [];
        dict[processedWord] = [...oldValue, id];
      }
      word = "";
    }
  }
  const processedWord = applySynonym(stemmer(word));
  if (processedWord.length > 2 && !isStopWord(processedWord)) {
    const oldValue = dict[stemmer(processedWord)] || [];
    dict[stemmer(processedWord)] = [...oldValue, id];
  }
  return dict;
};

const buildIndex = (posts) => {
  let index = {};

  posts.forEach((post) => {
    const title = post.snapshot.name;
    const labels = post.snapshot.labels.join(" ");
    const text = post.snapshot.description;
    const postType = post.snapshot.post_type;
    const authorId = post.author_id;
    const postText = `${authorId} ${postType} ${title} ${labels} ${text}`;
    index = fillDictionaryWith(index, postText, post.id);
  });
  return index;
};

const stemAndFilterQuery = (query) => {
  return Object.keys(fillDictionaryWith({}, query));
};

const sortSearchResult = (searchResult) => {
  // create a map to count the frequency of each element
  const freq = new Map();
  for (const num of searchResult) {
    freq.set(num, (freq.get(num) || 0) + 1);
  }

  // define a custom comparison function to sort the array
  function compare(a, b) {
    // compare the frequency of the two elements
    const freqDiff = freq.get(b) - freq.get(a);
    if (freqDiff !== 0) {
      return freqDiff; // if they have different frequency, sort by frequency
    } else {
      return 0; // if they have the same frequency, leave as it is. Will be sorted by search term, by date
    }
  }

  // sort the array using the custom comparison function
  searchResult.sort(compare);
  return searchResult.filter(
    (elem, index) => searchResult.indexOf(elem) === index
  );
};

const search = (processedQueryArray, index) => {
  return sortSearchResult(
    processedQueryArray.flatMap((queryWord) => {
      const termSearchRes = index[queryWord].reverse();
      const termSortedSearchRes = sortSearchResult(termSearchRes);
      return termSortedSearchRes;
    })
  );
};

//////////////////////////////////////////////////////////////////////
///UI&UX//////////////////////////////////////////////////////////////
//Run search and spelling computation every time the search bar modified
//but no more frequent than 1 time per 1.5 seconds
const amountOfResultsToShowFirst = 5;

const buildPostsIndex = () => {
  return Near.asyncView("devgovgigs.near", "get_posts").then((posts) => {
    const index = buildIndex(posts);
    const data = posts.reduce((acc, post) => {
      acc[post.id] = post;
      return acc;
    }, {});
    return { index, data };
  });
};

const getProcessedPostsCached = () => {
  return useCache(() => buildPostsIndex(), "processedPostsCached");
};

if (!state.interval) {
  let termStorage = "";
  Storage.privateSet("term", "");
  setInterval(() => {
    const currentInput = Storage.privateGet("term");
    if (currentInput !== termStorage) {
      termStorage = currentInput;
      computeResults(termStorage);
    }
  }, 1500);
  State.update({
    interval: true,
  });
}

const computeResults = (term) => {
  const start = new Date().getTime();
  const processedPostsCached = useCache(
    () =>
      buildPostsIndex().then((processedPosts) => {
        // Run query first time posts retrieved
        const query = term;
        const processedQuery = spellcheckQueryProcessing(
          query,
          processedPosts.index
        );
        const searchResult = search(processedQuery, processedPosts.index);
        console.log(processedQuery);
        console.log(searchResult);
        State.update({
          searchResult,
          shownSearchResults: searchResult.slice(0, amountOfResultsToShowFirst),
          processedQuery,
          loading: false,
        });
        return processedPosts;
      }),
    "processedPostsCached"
  );
  if (processedPostsCached) {
    // Run query every other time after data retrieved and cached
    const query = term;
    const processedQuery = spellcheckQueryProcessing(
      query,
      processedPostsCached.index
    );
    const searchResult = search(processedQuery, processedPostsCached.index);
    console.log(processedQuery);
    console.log(searchResult);
    State.update({
      searchResult,
      shownSearchResults: searchResult.slice(0, 10),
      processedQuery,
      loading: false,
    });
  }
  const end = new Date().getTime();
  console.log("search time: ", end - start);
};

const updateInput = (term) => {
  Storage.privateSet("term", term);
  State.update({
    term,
    loading: true,
  });
};

const getSearchResultsKeywordsFor = (postId) => {
  const index = getProcessedPostsCached().index;
  return state.processedQuery.filter((queryWord) => {
    return index[queryWord].includes(postId);
  });
};

const showMoreSearchResults = () => {
  const shownSearchResults = state.shownSearchResults || [];
  const newShownSearchResults = state.searchResult.slice(
    0,
    shownSearchResults.length + amountOfResultsToShowFirst
  );
  State.update({ shownSearchResults: newShownSearchResults });
};

return (
  <div class="pb-2">
    <div
      className="d-flex"
      style={{
        height: "38px",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "30px",
          display: "flex",
          height: "38px",
          "align-items": "center",
        }}
      >
        {state.loading ? (
          <div>
            <span
              className="spinner-grow spinner-grow-sm me-1"
              role="status"
              aria-hidden="true"
            />
          </div>
        ) : (
          <div>🔍</div>
        )}
      </div>
      <input
        type="search"
        style={{
          "padding-left": "40px",
        }}
        className="form-control"
        value={state.term ?? ""}
        onChange={(e) => updateInput(e.target.value)}
        placeholder={props.placeholder ?? `Search Posts`}
      />
    </div>
    {state.processedQuery &&
      state.processedQuery.length > 0 &&
      state.term.toLowerCase().trim() !== state.processedQuery.join(" ") && (
        <div class="mb-2" style={{ "font-family": "monospace" }}>
          No results for {state.term}. Looking for
          <strong>{state.processedQuery.join(" ")}</strong>:
        </div>
      )}
    {
      state.term && state.searchResult
        ? widget("components.posts.List", {
            searchResult: {
              postIds: state.searchResult,
              recency: props.recency,
              label: props.label,
            },
          })
        : widget("components.posts.List", {
            recency: props.recency,
            label: props.label,
          })

      // <InfiniteScroll
      //   pageStart={0}
      //   loadMore={showMoreSearchResults}
      //   hasMore={state.shownSearchResults.length < state.searchResult.length}
      //   loader={<div className="loader">Loading ...</div>}
      // >
      //     {widget()}
      //   {state.shownSearchResults.map((postId) => {
      //     return (
      //       <div key={postId} style={{ "min-height": "10em" }}>
      //         <Widget
      //           src={`p516entropy.near/widget/SearchResultPost`}
      //           props={{
      //             post: getProcessedPostsCached().data[postId],
      //             seachKeywords: getSearchResultsKeywordsFor(postId),
      //           }}
      //           key={key}
      //         />
      //       </div>
      //     );
      //   })}
      // </InfiniteScroll>
    }
  </div>
);
