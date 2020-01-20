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
            expect(body.user).to.be.an("array");
            expect(body.user[0].username).to.equal("butter_bridge");
            expect(body.user).that.have.length(1);
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
  describe("/api/articles/:article_id", () => {
    describe("GET", () => {
      it("Status: 200 gets an article by its id", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            expect(body.article).to.be.an("array");
            expect(body.article[0].article_id).to.equal(1);
            expect(body.article[0]).to.have.keys(
              "article_id",
              "title",
              "body",
              "votes",
              "topic",
              "author",
              "created_at"
              //"comment_count" RETURN TO THIS
            );
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
      it.only("Status: 200, updates an object with the specified votes property", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 1 })
          .expect(200)
          .then(({ body }) => {
            expect(body.article[0].votes).to.equal(101);
          });
      });
      it.only("Status: 200, can decrement votes", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: -2 })
          .expect(200)
          .then(({ body }) => {
            console.log(body);
            expect(body.article[0].votes).to.equal(98);
          });
      });
    });
  });
});
