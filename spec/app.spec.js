process.env.NODE_ENV = "test";
const connection = require("../db/connection");
const app = require("../app");
const request = require("supertest");
const chaiSorted = require("chai-sorted");
const chai = require("chai");
const { expect } = chai;
chai.use(chaiSorted);

beforeEach(() => connection.seed.run());
after(() => connection.destroy());

describe("/api", () => {
  describe("404 ERROR: incorrect path", () => {
    it("Status: 404 when passed an incorrect path", () => {
      return request(app)
        .get("/ap")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Route not found!");
        });
    });
  });
  describe("GET", () => {
    it("Status: 200 responds with a JSON describing all available endpoints on the API", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body.msg.apiInfo2).to.eql({
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
            "/api/comments/:comment_id DELETE":
              "Deletes the given comment by the id"
          });
        });
    });
  });
  describe("api/topics", () => {
    describe("GET", () => {
      it("Status: 200 responds with an array of topic objects with the correct properties", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            expect(body.topics).to.be.an("array");
            expect(body.topics[0]).to.include.keys("slug", "description");
          });
      });
    });
  });
  describe("ERRORS, /api/topics", () => {
    it("Status: 404 when passed an incorrect path", () => {
      return request(app)
        .get("/api/topppics")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Route not found!");
        });
    });
    it("Status: 405 for invalid method", () => {
      const methods = ["put", "patch", "delete", "post"];
      const methodPromises = methods.map(method => {
        return request(app)
          [method]("/api/topics")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
  });
  describe("/api/users/:username", () => {
    describe("GET", () => {
      it("Status 200: responds with a user topic with the correct properties", () => {
        return request(app)
          .get("/api/users/butter_bridge")
          .expect(200)
          .then(({ body }) => {
            expect(body.user).to.be.an("object");
            expect(body.user.username).to.equal("butter_bridge");
          });
      });
    });
    describe("ERRORS, api/users/:username", () => {
      it("Status: 404 when passed an incorrect path", () => {
        return request(app)
          .get("/api/usss")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Route not found!");
          });
      });
      it("Status: 400 when passed an non-existent username", () => {
        return request(app)
          .get("/api/users/notaUsername")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Username is non existent");
          });
      });
      it("Status: 405 for invalid method", () => {
        const methods = ["put", "patch", "delete", "post"];
        const methodPromises = methods.map(method => {
          return request(app)
            [method]("/api/topics")
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).to.equal("method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });
    });
  });

  describe("/api/articles", () => {
    it("Status: 404 when passed an incorrect path", () => {
      return request(app)
        .get("/api/art")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Route not found!");
        });
    });
    it("Status: 405 for an invalid method", () => {
      const methods = ["put", "post", "patch", "delete"];
      const methodPromises = methods.map(method => {
        return request(app)
          [method]("/api/articles")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
    it("Status: 200 responds with an array of articles with the correct keys", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.an("array");
          expect(body.articles[0]).to.include.keys(
            "author",
            "title",
            "article_id",
            "topic",
            "created_at",
            "votes",
            "comment_count"
          );
        });
    });
    describe("QUERIES", () => {
      it("can sort the articles by any valid column", () => {
        return request(app)
          .get("/api/articles?sort_by=created_at")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.sortedBy("created_at", {
              descending: true
            });
          });
      });
      it("can sort the articles by any valid column", () => {
        return request(app)
          .get("/api/articles?sort_by=votes")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.sortedBy("votes", { descending: true });
          });
      });
      it("accepts an order query, articles sorted in descending order", () => {
        return request(app)
          .get("/api/articles?order=desc")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.sortedBy("created_at", {
              descending: true
            });
          });
      });
      it("can filter the articles by username value", () => {
        return request(app)
          .get("/api/articles?author=butter_bridge")
          .expect(200)
          .then(({ body }) => {
            body.articles.forEach(article => {
              expect(article.author).to.equal("butter_bridge");
            });
          });
      });
      it("can filter the articles by username value", () => {
        return request(app)
          .get("/api/articles?author=icellusedkars")
          .expect(200)
          .then(({ body }) => {
            body.articles.forEach(article => {
              expect(article.author).to.equal("icellusedkars");
            });
          });
      });
      it("can filter the articles by topic", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then(({ body }) => {
            body.articles.forEach(article => {
              expect(article.topic).to.equal("mitch");
            });
          });
      });
      it("serves an empty array when topic exists but has no articles", () => {
        return request(app)
          .get("/api/articles?topic=paper")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).have.length(0);
          });
      });
      describe("QUERY ERRORS", () => {
        it("Status: 400 invalid sort_by column in query", () => {
          return request(app)
            .get("/api/articles?sort_by=notacolumn")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal(
                "Bad Request-You have done something wrong!"
              );
            });
        });
        it("Status: 400 invalid datatype in query", () => {
          return request(app)
            .get("/api/articles?sort_by=7")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal(
                "Bad Request-You have done something wrong!"
              );
            });
        });
        it("Status: 400 invalid column in query for order", () => {
          return request(app)
            .get("/api/articles?order=nononon")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("order not valid");
            });
        });
      });
    });
    describe("/api/articles/:article_id", () => {
      describe("GET", () => {
        it("Status: 200 gets an article by its id", () => {
          return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body }) => {
              expect(body.article).to.be.an("object");
              expect(body.article.article_id).to.equal(1);
              expect(body.article).to.have.keys(
                "article_id",
                "title",
                "body",
                "votes",
                "topic",
                "author",
                "created_at",
                "comment_count"
              );
              expect(body.article.comment_count).to.equal("13");
            });
        });

        describe("ERRORS, /api/articles/:article_id", () => {
          it("Status: 404 for an invalid path", () => {
            return request(app)
              .get("/api/articlesdf/1")
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.equal("Route not found!");
              });
          });
          it("Status: 404 for a valid but non-existent id", () => {
            return request(app)
              .get("/api/articles/28000")
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.equal("Id is non-existent");
              });
          });
          it("Status: 400 for an invalid id", () => {
            return request(app)
              .get("/api/articles/notAnId")
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal(
                  "Bad Request-You have done something wrong!"
                );
              });
          });
          it("Status: 405 for invalid method", () => {
            const methods = ["put", "delete"];
            const methodPromises = methods.map(method => {
              return request(app)
                [method]("/api/articles/1")
                .expect(405)
                .then(({ body }) => {
                  expect(body.msg).to.equal("method not allowed");
                });
            });
            return Promise.all(methodPromises);
          });
        });
      });
      describe("PATCH", () => {
        it("Status: 200, updates an object with the specified votes property", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: 1 })
            .expect(200)
            .then(({ body }) => {
              expect(body.article).to.be.an("object");
              expect(body.article.votes).to.equal(101);
            });
        });
        it("Status: 200, can decrement votes", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: -2 })
            .expect(200)
            .then(({ body }) => {
              expect(body.article.votes).to.equal(98);
            });
        });
        it("works for a different article", () => {
          return request(app)
            .patch("/api/articles/3")
            .send({ inc_votes: 4 })
            .expect(200)
            .then(({ body }) => {
              expect(body.article.votes).to.equal(4);
            });
        });
        describe("ERRORS", () => {
          it("Status: 404 for a valid but non-existent id", () => {
            return request(app)
              .patch("/api/articles/28000")
              .send({ inc_votes: 4 })
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.equal("Id is non-existent");
              });
          });
          it("Status: 400 for an invalid id", () => {
            return request(app)
              .patch("/api/articles/notAnId")
              .send({ inc_votes: 4 })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal(
                  "Bad Request-You have done something wrong!"
                );
              });
          });
          it("Status: 400 when sending an empty object", () => {
            return request(app)
              .patch("/api/articles/1")
              .send({})
              .expect(200)
              .then(({ body }) => {
                expect(body.article).to.eql({
                  article_id: 1,
                  title: "Living in the shadow of a great man",
                  body: "I find this existence challenging",
                  votes: 100,
                  topic: "mitch",
                  author: "butter_bridge",
                  created_at: "2018-11-15T12:21:54.171Z"
                });
              });
          });

          it("Status: 400 when sending an invalid datatype", () => {
            return request(app)
              .patch("/api/articles/1")
              .send({ inc_votes: "string" })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal(
                  "Bad Request-You have done something wrong!"
                );
              });
          });
        });
      });
      describe("/api/articles/:article_id/comments", () => {
        describe("ERRORS", () => {
          it("Status: 405 for invalid method", () => {
            const methods = ["put", "patch", "delete"];
            const methodPromises = methods.map(method => {
              return request(app)
                [method]("/api/articles/1/comments")
                .expect(405)
                .then(({ body }) => {
                  expect(body.msg).to.equal("method not allowed");
                });
            });
            return Promise.all(methodPromises);
          });
          it("Status: 404 when passed an invalid path", () => {
            return request(app)
              .post("/api/articles/1/commts")
              .send({ username: "butter_bridge", body: "comment lalal..." })
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.equal("Route not found!");
              });
          });
        });
        describe("POST", () => {
          it("Status: 201 posts a comment to an article", () => {
            return request(app)
              .post("/api/articles/1/comments")
              .send({
                username: "butter_bridge",
                body: "comment lalal..."
              })
              .expect(201)
              .then(({ body }) => {
                expect(body.comment).to.include.keys(
                  "body",
                  "comment_id",
                  "article_id",
                  "votes",
                  "created_at"
                );
              });
          });
          describe("POST ERRORS", () => {
            it("Status 400: when posting an empty object", () => {
              return request(app)
                .post("/api/articles/1/comments")
                .send({})
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).to.equal(
                    "Bad Request-You have done something wrong!"
                  );
                });
            });
            it("Status: 400 when posting invalid datatype in column", () => {
              return request(app)
                .post("/api/articles/1/comments")
                .send({ username: "butter_bridge", body: null })
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).to.equal(
                    "Bad Request-You have done something wrong!"
                  );
                });
            });
            it("Status: 400 when posting with missing columns", () => {
              return request(app)
                .post("/api/articles/1/comments")
                .send({ username: "butter_bridge" })
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).to.equal(
                    "Bad Request-You have done something wrong!"
                  );
                });
            });
            it("Status: 422 when posting a correctly formatted object with a reference id that does not exist", () => {
              return request(app)
                .post("/api/articles/75000/comments")
                .send({
                  username: "notAuser",
                  body: "comment lalal..."
                })
                .expect(422)
                .then(({ body }) => {
                  expect(body.msg).to.equal("Reference id does not exist");
                });
            });
            it("Status: 400 for an invalid id", () => {
              return request(app)
                .post("/api/articles/notAnId/comments")
                .send({ username: "butter_bridge", body: "comment lalal..." })
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).to.equal(
                    "Bad Request-You have done something wrong!"
                  );
                });
            });
          });
        });
        describe("GET", () => {
          it("Status: 200, responds with an array of comments with the correct properties", () => {
            return request(app)
              .get("/api/articles/1/comments")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments).to.be.an("array");
                expect(body.comments[0]).to.include.keys(
                  "comment_id",
                  "votes",
                  "created_at",
                  "author",
                  "body"
                );
                expect(body.comments[1]).to.include.keys(
                  "comment_id",
                  "votes",
                  "created_at",
                  "author",
                  "body"
                );
              });
          });
          it("Status: 200 send back an empty array when an article exists but has no comments", () => {
            return request(app)
              .get("/api/articles/2/comments")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments).to.be.an("array");
                expect(body.comments).to.have.length(0);
              });
          });
          describe("QUERY", () => {
            it("Status: 200 sorts the results by any valid column", () => {
              return request(app)
                .get("/api/articles/1/comments?sort_by=created_at")
                .expect(200)
                .then(({ body }) => {
                  expect(body.comments).to.be.sortedBy("created_at", {
                    descending: true
                  });
                });
            });
            it("Status: 200 sorts the results by any valid column", () => {
              return request(app)
                .get("/api/articles/1/comments?sort_by=votes")
                .expect(200)
                .then(({ body }) => {
                  expect(body.comments).to.be.sortedBy("votes", {
                    descending: true
                  });
                });
            });
            it("accepts an order query, comments sorted in descending order", () => {
              return request(app)
                .get("/api/articles/1/comments?order=desc")
                .expect(200)
                .then(({ body }) => {
                  expect(body.comments).to.be.sortedBy("created_at", {
                    descending: true
                  });
                });
            });

            describe("QUERY ERRORS", () => {
              it("Status: 400 invalid sort_by column in query", () => {
                return request(app)
                  .get("/api/articles/1/comments?sort_by=notacolumn")
                  .expect(400)
                  .then(({ body }) => {
                    expect(body.msg).to.equal(
                      "Bad Request-You have done something wrong!"
                    );
                  });
              });
              it("Status: 400 invalid datatype in query", () => {
                return request(app)
                  .get("/api/articles/1/comments?sort_by=7")
                  .expect(400)
                  .then(({ body }) => {
                    expect(body.msg).to.equal(
                      "Bad Request-You have done something wrong!"
                    );
                  });
              });
              it("Status: 400 invalid column in query for order", () => {
                return request(app)
                  .get("/api/articles/1/comments?sort_by=lalalala")
                  .expect(400)
                  .then(({ body }) => {
                    expect(body.msg).to.equal(
                      "Bad Request-You have done something wrong!"
                    );
                  });
              });
            });
          });
        });
        describe("ERRORS, GET", () => {
          it("Status: 404 for a valid but non-existent id", () => {
            return request(app)
              .get("/api/articles/28000/comments")
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.equal("Id does not exist!");
              });
          });
          it("Status: 400 for an invalid id", () => {
            return request(app)
              .get("/api/articles/notAnId/comments")
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal(
                  "Bad Request-You have done something wrong!"
                );
              });
          });
        });
      });
    });
  });
  describe("/api/comments/:comment_id", () => {
    describe("ERRORS, ", () => {
      it("Status: 404 when passed an invalid path", () => {
        return request(app)
          .post("/api/commens/1")
          .send({ username: "butter_bridge", body: "comment lalal..." })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Route not found!");
          });
      });
      it("Status: 405 for invalid method", () => {
        const methods = ["put", "post", "get"];
        const methodPromises = methods.map(method => {
          return request(app)
            [method]("/api/comments/1")
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).to.equal("method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });
      describe("PATCH", () => {
        it("Status: 200, updates an object based on its votes property", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: 1 })
            .expect(200)
            .then(({ body }) => {
              expect(body.comment).to.be.an("object");
              expect(body.comment.votes).to.equal(17);
            });
        });
        it("Status: 200, can decrement votes", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: -2 })
            .expect(200)
            .then(({ body }) => {
              expect(body.comment.votes).to.equal(14);
            });
        });
        it("works for a different comment", () => {
          return request(app)
            .patch("/api/comments/3")
            .send({ inc_votes: 4 })
            .expect(200)
            .then(({ body }) => {
              expect(body.comment.votes).to.equal(104);
            });
        });
        describe("ERRORS", () => {
          it("Status: 404 for a valid but non-existent id", () => {
            return request(app)
              .patch("/api/comments/28000")
              .send({ inc_votes: 4 })
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.equal("Id is non-existent");
              });
          });
          it("Status: 400 for an invalid id", () => {
            return request(app)
              .patch("/api/comments/notAnId")
              .send({ inc_votes: 4 })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal(
                  "Bad Request-You have done something wrong!"
                );
              });
          });
          it("Status: 400 when sending an empty object", () => {
            return request(app)
              .patch("/api/comments/1")
              .send({})
              .expect(200)
              .then(({ body }) => {
                expect(body.comment).to.eql({
                  comment_id: 1,
                  author: "butter_bridge",
                  article_id: 9,
                  votes: 16,
                  created_at: "2017-11-22T12:36:03.389Z",
                  body:
                    "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
                });
              });
          });

          it("Status: 400 when sending an invalid datatype", () => {
            return request(app)
              .patch("/api/comments/1")
              .send({ inc_votes: "string" })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal(
                  "Bad Request-You have done something wrong!"
                );
              });
          });
        });
      });

      describe("DELETE", () => {
        it("Status: 204, deletes a comment by its id", () => {
          return request(app)
            .delete("/api/comments/1")
            .expect(204);
        });
        it("Status: 404 when comment does not exist", () => {
          return request(app)
            .delete("/api/comments/4000")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("comment_id does not exist!");
            });
        });
        it("Status: 404 when passed an invalid id", () => {
          return request(app)
            .delete("/api/comments/notAnId")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal(
                "Bad Request-You have done something wrong!"
              );
            });
        });
      });
    });
  });
});
