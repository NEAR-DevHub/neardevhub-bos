const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

export function createLotsOfBlogs({ communityAddonIds }) {
  const topics = [
    "Cows",
    "Cars",
    "Sheep",
    "Birds",
    "Computers",
    "Blockchain technology",
    "Artificial intelligence",
    "Search for extra terrestrial life",
    "The meaning of life",
  ];
  const categories = ["Animals", "Tech", "Vehicle", "Philosophy"];

  const blogPosts = {};
  for (let n = 0; n < 100; n++) {
    const topic = topics[n % topics.length];
    const blogDate = new Date(2024, 0, 1);
    blogDate.setDate(n);
    blogPosts["new-blog-post-cg" + n] = {
      "": `# Blog post ${n + 1}
This is an article about ${topic}.
`,
      metadata: {
        title: "New Blog Post" + n,
        createdAt: blogDate.toJSON(),
        updatedAt: blogDate.toJSON(),
        publishedAt: blogDate.toJSON(),
        status: "PUBLISH",
        subtitle: `${topic.substring(0, 1).toUpperCase()}${topic.substring(1)}`,
        description: `${topic.substring(0, 1).toUpperCase()}${topic.substring(
          1
        )}`,
        author: "Author",
        communityAddonId: getRandomElement(communityAddonIds),
        category: categories[n % categories.length],
      },
    };
  }
  return { blogPosts, categories, topics };
}

export async function mockBlogs(route) {
  const request = await route.request();
  const requestPostData = request.postDataJSON();
  const communityAccount = "webassemblymusic.community.devhub.near";
  // Intercept the actual route
  const response = await route.fetch();
  const json = await response.json();
  const regex = /webassemblymusic\.community\.devhub\.near\/blog\/(.+)\/\*\*/g;

  if (
    requestPostData &&
    requestPostData.keys &&
    requestPostData.keys[0] === `${communityAccount}/blog/**`
  ) {
    const { blogPosts } = createLotsOfBlogs({
      communityAddonIds: [
        "blogv2",
        "blogv2instance2",
        "g1709r",
        "blogv2instance4",
      ],
    });

    // Mock blog responses
    json[communityAccount]["blog"] = {
      "hello-world-0r4rmr": {
        "": "# Content\n\n## subcontent\n\n### h3",
        metadata: {
          title: "Hello World",
          createdAt: "2024-04-28",
          updatedAt: "2024-04-28",
          publishedAt: "1998-05-03",
          status: "DRAFT",
          subtitle: "Subtitle",
          description: "Description",
          author: "thomasguntenaar.near",
          communityAddonId: "blogv2",
          category: "guide",
        },
      },
      "published-w5cj1y": {
        "": "# Content\n\n",
        metadata: {
          title: "PublishedBlog",
          createdAt: "2024-04-29",
          updatedAt: "2024-04-29",
          publishedAt: "2024-04-30",
          status: "PUBLISH",
          subtitle: "subtitle",
          description: "Description",
          author: "thomasguntenaar.near",
          communityAddonId: "g1709r",
          category: "news",
        },
      },
      "published-w5cj1y2": {
        "": "# Content\n\n",
        metadata: {
          title: "PublishedBlog",
          createdAt: "2024-04-29",
          updatedAt: "2024-04-29",
          publishedAt: "2024-04-30",
          status: "PUBLISH",
          subtitle: "subtitle",
          description: "Description",
          author: "thomasguntenaar.near",
          communityAddonId: "blogv2",
          category: "news",
        },
      },
      "this-is-the-blog-title-xfxkzh": {
        "": "# Content\n\n",
        metadata: {
          title: "PublishedBlog",
          createdAt: "2024-04-29",
          updatedAt: "2024-04-29",
          publishedAt: "2024-04-30",
          status: "PUBLISH",
          subtitle: "subtitle",
          description: "Description",
          author: "thomasguntenaar.near",
          communityAddonId: "g1709r",
          category: "news",
        },
      },
      "first-blog-of-instance-2-nhasab": {
        "": "# First ever blog seperate from instance 1",
        metadata: {
          title: "First blog of instance",
          createdAt: "2024-04-30",
          updatedAt: "2024-05-13",
          publishedAt: "2024-04-30",
          status: "PUBLISH",
          subtitle: "Subtitle",
          description: "Description",
          author: "thomasguntenaar.near",
          communityAddonId: "blogv2instance2",
          category: "reference",
        },
      },
      "new-blog-post-cgomff": {
        "": "# Content",
        metadata: {
          title: "New Blog Post",
          createdAt: "2024-05-01",
          updatedAt: "2024-05-13",
          publishedAt: "1998-05-03",
          status: "PUBLISH",
          subtitle: "Subtitle",
          description: "Description",
          author: "thomasguntenaar.near",
          communityAddonId: "blogv2instance2",
          category: "news",
        },
      },
      "test-subscribe-mujrt8": {
        "": "# Content",
        metadata: {
          title: "Test Subscribe",
          publishedAt: "2023-04-03",
          status: "PUBLISH",
          subtitle: "subtitle",
          description: "description",
          author: "thomasguntenaar.near",
          createdAt: "2024-05-01",
          communityAddonId: "blogv2",
          category: "guide",
          updatedAt: "2024-05-13",
        },
      },
      ...blogPosts,
    };

    await route.fulfill({ response, json });
  } else if (
    requestPostData &&
    requestPostData.keys &&
    requestPostData.keys[0].match(regex) // On the blog page blogv2.Blog
  ) {
    const blogId = requestPostData.keys[0].split("/blog/")[1].split("/")[0];
    // Mock blog responses
    json[communityAccount]["blog"] = {
      [blogId]: {
        "": "# Content\n\n## subcontent\n\n### h3",
        metadata: {
          title: "Hello World",
          createdAt: "2024-04-28",
          updatedAt: "2024-04-28",
          publishedAt: "1998-05-03",
          status: "DRAFT",
          subtitle: "Subtitle",
          description: "Description",
          author: "thomasguntenaar.near",
          category: "news",
          communityAddonId:
            json[communityAccount]["blog"][blogId].metadata.communityAddonId ||
            "g1709r",
        },
      },
    };
    await route.fulfill({ response, json });
  } else {
    await route.continue();
  }
}

export async function setupBlogContentResponses(page) {
  const { blogPosts, categories, topics } = createLotsOfBlogs({
    communityAddonIds: ["blogv2"],
  });
  await page.route("https://api.near.social/get", async (route) => {
    const request = route.request();
    const requestBody = request.postDataJSON();

    if (
      requestBody.keys[0] === "webassemblymusic.community.devhub.near/blog/**"
    ) {
      const blogResults = {
        "webassemblymusic.community.devhub.near": {
          blog: blogPosts,
        },
      };
      await route.fulfill({
        headers: { "content-type": "application/json" },
        body: JSON.stringify(blogResults, null, 1),
      });
    } else {
      await route.continue();
    }
  });
  return { categories, topics, blogPosts };
}
