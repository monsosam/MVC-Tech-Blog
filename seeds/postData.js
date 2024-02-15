const { Post } = require('../models');

const postdata =
[
  {
    "postTitle": "The Color Red",
    "postContent": "Here is a red object",
    "userId": 1
  },
  {
    "postTitle": "Sky",
    "postContent": "The sky and ocean are blue",
    "userId": 2
  },
  {
    "postTitle": "Everything",
    "postContent": "Everything is in all",
    "userId": 3
  }
];

const seedPost = () => Post.bulkCreate(postdata);

module.exports = seedPost;