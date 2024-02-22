const sequelize = require('../config/connection')
const {User, Comment, Post} = require('../models')

const userData = require('./userData.json')
const postData = require('./blogData.json')
const commentData = require('./commentData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
      individualHooks: true,
      returning: true,
  });

  const posts = await Post.bulkCreate(postData, {
      returning: true,
  });

  for (const comments of commentData) {
      await Comment.create({
          ...comments,
          user_id: users[Math.floor(Math.random() * users.length)].id,
      });
  }

  process.exit(0);
};

seedDatabase();