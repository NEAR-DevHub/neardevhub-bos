const RFP_TIMELINE_STATUS = {
  ACCEPTING_SUBMISSIONS: "ACCEPTING_SUBMISSIONS",
  EVALUATION: "EVALUATION",
  PROPOSAL_SELECTED: "PROPOSAL_SELECTED",
  CANCELLED: "CANCELLED",
};

const PROPOSAL_TIMELINE_STATUS = {
  DRAFT: "DRAFT",
  REVIEW: "REVIEW",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  CANCELED: "CANCELLED",
  APPROVED_CONDITIONALLY: "APPROVED_CONDITIONALLY",
  PAYMENT_PROCESSING: "PAYMENT_PROCESSING",
  FUNDED: "FUNDED",
};

const cacheUrl = "https://infra-cache-api-rs.fly.dev";

/**
 * Get proposals or rfps from cache api
 * @param {proposals | rfps} entity
 * @param {order, limit, offset, author_id, stage, category} variables
 * @returns result.records, result.total_records, result.total_pages
 */
function fetchCacheApi(entity, variables) {
  console.log("Fetching cache api", variables);

  let fetchUrl = `${cacheUrl}/${entity}?order=${variables.order}&limit=${variables.limit}&offset=${variables.offset}`;

  if (variables.author_id) {
    fetchUrl += `&filters.author_id=${variables.author_id}`;
  }
  if (variables.stage) {
    fetchUrl += `&filters.stage=${variables.stage}`;
  }
  if (variables.category) {
    // Devhub uses category, infra uses labels
    fetchUrl += `&filters.labels=${variables.category}`;
  }
  console.log("Fetching.. from infra common", fetchUrl);
  return asyncFetch(fetchUrl, {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  }).catch((error) => {
    console.log("Error fetching cache api", error);
  });
}

function searchCacheApi(entity, searchTerm) {
  let searchInput = encodeURI(searchTerm);
  let searchUrl = `${cacheUrl}/${entity}/search/${searchInput}`;

  return asyncFetch(searchUrl, {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  }).catch((error) => {
    console.log(`Error searching cache api in entity ${entity}:`, error);
  });
}

/**
 * Get proposals or rfps from cache api
 * @param {proposals | rfps} entity
 * @param {order, limit, offset, author_id, stage, category} variables
 * @returns result.records, result.total_records, result.total_pages
 */
function fetchCacheApi(entity, variables) {
  console.log("Fetching cache api", variables);

  let fetchUrl = `${cacheUrl}/${entity}?order=${variables.order}&limit=${variables.limit}&offset=${variables.offset}`;

  if (variables.author_id) {
    fetchUrl += `&filters.author_id=${variables.author_id}`;
  }
  if (variables.stage) {
    fetchUrl += `&filters.stage=${variables.stage}`;
  }
  if (variables.category) {
    // Devhub uses category, infra uses labels
    fetchUrl += `&filters.labels=${variables.category}`;
  }
  console.log("Fetching.. from infra common", fetchUrl);
  return asyncFetch(fetchUrl, {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  }).catch((error) => {
    console.log("Error fetching cache api", error);
  });
}

function searchCacheApi(entity, searchTerm) {
  let searchInput = encodeURI(searchTerm);
  let searchUrl = `${cacheUrl}/${entity}/search/${searchInput}`;

  return asyncFetch(searchUrl, {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  }).catch((error) => {
    console.log(`Error searching cache api in entity ${entity}:`, error);
  });
}

const CANCEL_RFP_OPTIONS = {
  CANCEL_PROPOSALS: "CANCEL_PROPOSALS",
  UNLINK_PROPOSALS: "UNLINK_PROPOSALSS",
  NONE: "NONE",
};

function parseJSON(json) {
  if (typeof json === "string") {
    try {
      return JSON.parse(json);
    } catch (error) {
      return json;
    }
  } else {
    return json;
  }
}

function isNumber(value) {
  return typeof value === "number";
}

const PROPOSALS_APPROVED_STATUS_ARRAY = [
  PROPOSAL_TIMELINE_STATUS.APPROVED,
  PROPOSAL_TIMELINE_STATUS.APPROVED_CONDITIONALLY,
  PROPOSAL_TIMELINE_STATUS.PAYMENT_PROCESSING,
  PROPOSAL_TIMELINE_STATUS.FUNDED,
];

function getLinkUsingCurrentGateway(url) {
  const data = fetch(`https://httpbin.org/headers`);
  const gatewayURL = data?.body?.headers?.Origin ?? "";
  return `https://${
    gatewayURL.includes("near.org") ? "dev.near.org" : "near.social"
  }/${url}`;
}

return {
  RFP_TIMELINE_STATUS,
  PROPOSAL_TIMELINE_STATUS,
  CANCEL_RFP_OPTIONS,
  parseJSON,
  isNumber,
  PROPOSALS_APPROVED_STATUS_ARRAY,
  getLinkUsingCurrentGateway,
  searchCacheApi,
  fetchCacheApi,
};
