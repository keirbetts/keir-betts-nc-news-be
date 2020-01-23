exports.apiInfo2 = {
  "/api/topics":
    "responds with an array of topic objects with the properties slug and description",
  "api/users/:username":
    "responds with a user object with the properties username, name and avatae_url",
  "/api/articles":
    "responds with an array of article objects with the correct properties and a comment_count",
  "/api/articles/:article_id":
    "responds with an article object with the correct properties and a comment_count",
  "api/articles/:article_id, PATCH":
    "Updates the votes property on the article object",
  "api/articles/:article_id/comments POST":
    "posts an object with the properties username and body",
  "api/articles/:article_id/comments GET":
    "responds with an array of comments with the correct properties, accepts the correct queries",
  "/api/comments/:comment_id PATCH":
    "Updates the votes property on the comments object",
  "/api/comments/:comment_id DELETE": "Deletes the given comment by the id"
};
