const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("when passed an empty array returns a new array", () => {
    expect(formatDates([])).to.eql([]);
  });
  it("When passed data returns a javaScript date object", () => {
    const data = [
      {
        title: "A BRIEF HISTORY OF FOOD—NO BIG DEAL",
        topic: "cooking",
        author: "tickle122",
        body:
          "n 1686, the croissant was invented in Austria. That's a fun fact I'd probably never had known or maybe don't even really need to know, but now I do, thanks to Julia Rothman's Food Anatomy: The Curious Parts & Pieces of Our Edible World. Rothman has an entire series of illustrated Anatomy books, including Nature and Farm, packed with infographics, quirky facts, and maps that you can get lost in for hours—in a fun way, not in a boring textbook way. It makes you wonder why textbooks aren't this fun to read. Can someone look into this? Thanks.",
        created_at: 1489238418573
      }
    ];
    expect(formatDates(data)[0].created_at).to.be.an.instanceOf(Date);
  });
  it("Works for a longer array", () => {
    const data = [
      {
        title: "Sweet potato & butternut squash soup with lemon & garlic toast",
        topic: "cooking",
        author: "weegembump",
        body:
          "Roast your vegetables in honey before blitzing into this velvety smooth, spiced soup - served with garlicky, zesty ciabatta slices for dipping",
        created_at: 1503048314275
      },
      {
        title: "HOW COOKING HAS CHANGED US",
        topic: "cooking",
        author: "weegembump",
        body:
          "In a cave in South Africa, archaeologists have unearthed the remains of a million-year-old campfire, and discovered tiny bits of animal bones and ash from plants. It’s the oldest evidence of our ancient human ancestors—probably Homo erectus, a species that preceded ours—cooking a meal.",
        created_at: 1492778094761
      }
    ];
    expect(formatDates(data)[0].created_at).to.be.an.instanceOf(Date);
    expect(formatDates(data)[1].created_at).to.be.an.instanceOf(Date);
  });
  it("Does not mutate the original array", () => {
    const data = [
      {
        title: "Sweet potato & butternut squash soup with lemon & garlic toast",
        topic: "cooking",
        author: "weegembump",
        body:
          "Roast your vegetables in honey before blitzing into this velvety smooth, spiced soup - served with garlicky, zesty ciabatta slices for dipping",
        created_at: 1503048314275
      }
    ];
    formatDates(data);
    expect(data).to.eql([
      {
        title: "Sweet potato & butternut squash soup with lemon & garlic toast",
        topic: "cooking",
        author: "weegembump",
        body:
          "Roast your vegetables in honey before blitzing into this velvety smooth, spiced soup - served with garlicky, zesty ciabatta slices for dipping",
        created_at: 1503048314275
      }
    ]);
  });
});

describe("makeRefObj", () => {
  it("when passed an empty array returns an empty object", () => {
    expect(makeRefObj([])).to.eql({});
  });
  it("returns refObj which has a key of title and a property of article_id", () => {
    const articles = [
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];
    expect(makeRefObj(articles)).to.eql({
      "Living in the shadow of a great man": 1
    });
  });
  it("works for multiple items in an array", () => {
    const articles = [
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      },
      {
        article_id: 2,
        title: "Sony Vaio; or, The Laptop",
        topic: "mitch",
        author: "icellusedkars",
        body:
          "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
        created_at: 1416140514171
      }
    ];
    expect(makeRefObj(articles)).to.deep.equal({
      "Living in the shadow of a great man": 1,
      "Sony Vaio; or, The Laptop": 2
    });
  });
  it("Does not mutate the original array", () => {
    const articles = [
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];

    makeRefObj(articles);
    expect(articles).to.eql([
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ]);
  });
});

describe("formatComments", () => {
  it("returns an empty array when passed an empty array", () => {
    expect(formatComments([])).to.eql([]);
  });
  it("returns an array of formatted comments", () => {
    const comments = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];
    const refObj2 = { "They're not exactly dogs, are they?": 9 };
    expect(formatComments(comments, refObj2)).to.deep.equal([
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        created_at: new Date(1511354163389),
        article_id: 9,
        author: "butter_bridge"
      }
    ]);
  });
  it("can format a longer array of comments", () => {
    const comments = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      },
      {
        body: " I carry a log — yes. Is it funny to you? It is not to me.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "icellusedkars",
        votes: -100,
        created_at: 1416746163389
      }
    ];
    const refObj2 = {
      "They're not exactly dogs, are they?": 9,
      "Living in the shadow of a great man": 1
    };
    expect(formatComments(comments, refObj2)).to.deep.equal([
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        created_at: new Date(1511354163389),
        article_id: 9,
        author: "butter_bridge"
      },
      {
        body: " I carry a log — yes. Is it funny to you? It is not to me.",
        votes: -100,
        created_at: new Date(1416746163389),
        article_id: 1,
        author: "icellusedkars"
      }
    ]);
  });
  it("Does not mutate the original array", () => {
    const commentArray = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];
    const refObj2 = { "They're not exactly dogs, are they?": 9 };
    formatComments(commentArray, refObj2);
    expect(commentArray).to.eql([
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ]);
  });
});
