const sequelize = require("../config/connection");
const { User, Blog } = require("../models");

const userData = require("./userData.json");
const blogData = require("./blogData.json");

const seedDatabase = async () => {
  try {

    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, {raw: true});

    await sequelize.sync({ force: true });

    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, {raw: true});

    const users = await User.bulkCreate(userData, {
      individualHooks: true,
      returning: true,
    });

    for (const blog of blogData) {
      await Blog.create({
        ...blog,
        user_id: users[Math.floor(Math.random() * users.length)].id,
      });
    }
  } catch (error) {
    console.error("Failed to seed database:", error);
  } finally {
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, {raw: true}).catch(console.error);
    process.exit(0);
  }
};

seedDatabase();
