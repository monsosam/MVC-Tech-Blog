const { User } = require('../models');

const userdata =
[
  {
    "username": "Sally",
    "password": "password"
  },
  {
    "username": "Bob",
    "password": "password"
  },
  {
    "username": "John",
    "password": "password"
  }
];

const seedUser = () => User.bulkCreate(userdata, {
  individualHooks: true,
  returning: true,
});

module.exports = seedUser;