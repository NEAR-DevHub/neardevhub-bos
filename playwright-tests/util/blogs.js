export async function mockBlogs(route) {
  const request = await route.request();
  const requestPostData = request.postDataJSON();
  const communityAccount = "webassemblymusic.community.devhub.near";
  // Intercept the actual route
  const response = await route.fetch();
  const json = await response.json();

  if (
    requestPostData &&
    requestPostData.keys &&
    requestPostData.keys[0] === `${communityAccount}/blog/**`
  ) {
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
          author: "author",
          communityAddonId: "blogv2",
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
    };

    await route.fulfill({ response, json });
  } else {
    await route.continue();
  }
}
