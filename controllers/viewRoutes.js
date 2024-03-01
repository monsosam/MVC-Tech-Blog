const router = require("express").Router();
const { User, Comment, Blog } = require("../models");
const withAuth = require("../utils/auth");

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

router.get("/", asyncHandler(async (req, res) => {
  let blogs = await Blog.findAll({
    include: User,
  });
  // Convert Sequelize objects to plain objects after awaiting the Promise
  blogs = blogs.map((blog) => blog.get({ plain: true }));

  res.render("homepage", { blogs, logged_in: req.session.logged_in });
}));

router.get("/dashboard", withAuth, asyncHandler(async (req, res) => {
  let blogs = await Blog.findAll({
    where: { user_id: req.session.user_id },
    include: User,
  });
  // Convert Sequelize objects to plain objects
  blogs = blogs.map((blog) => blog.get({ plain: true }));

  res.render("dashboard", { blogs, url: req.originalUrl, logged_in: req.session.logged_in });
}));

router.get("/createblog", withAuth, asyncHandler(async (req, res) => {
  let user = await User.findOne({ where: { id: req.session.user_id } });
  // Convert Sequelize object to a plain object
  user = user.get({ plain: true });

  res.render("createblog", { user, url: req.originalUrl, logged_in: req.session.logged_in });
}));

router.get("/editblog/:id", withAuth, asyncHandler(async (req, res) => {
  let blog = await Blog.findOne({
    where: { id: req.params.id },
    include: [User, Comment],
  });
  // Convert Sequelize object to a plain object
  blog = blog.get({ plain: true });

  res.render("editblog", { blog, url: req.originalUrl, logged_in: req.session.logged_in });
}));

router.get("/blog/:id", asyncHandler(async (req, res) => {
  let blog = await Blog.findOne({
    where: { id: req.params.id },
    include: [User, Comment],
  });
  blog = blog.get({ plain: true });

  let comments = await Comment.findAll({
    where: { blog_id: req.params.id },
    include: [User, Blog],
  });
  // Convert Sequelize objects to plain objects
  comments = comments.map((comment) => comment.get({ plain: true }));

  res.render("blog", { blog, comments, logged_in: req.session.logged_in });
}));

router.get("/login", (req, res) => {
  if (req.session.logged_in) {
    return res.redirect("/");
  }
  res.render("login");
});

module.exports = router;