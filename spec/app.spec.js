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
  describe("ERRORS", () => {
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
    it("Status 200: responds with a user topic with the correct properties", () => {
      return request(app)
        .get("/api/users/butter_bridge")
        .expect(200)
        .then(({ body }) => {
          console.log(body.user);
          expect(body.user).to.be.an("array");
          expect(body.user[0].username).to.equal("butter_bridge");
        });
    });
  });
});
