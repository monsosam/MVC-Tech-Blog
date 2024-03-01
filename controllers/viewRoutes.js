const router = require("express").Router();
const { User, Comment, Blog } = require("../models");
const withAuth = require("../utils/auth");

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

router.get("/", asyncHandler(async (req, res) => {
  const blogs = await Blog.findAll({
    include: User,
  }).map((blog) => blog.get({ plain: true }));

  res.render("homepage", { blogs, logged_in: req.session.logged_in });
}));

router.get("/dashboard", withAuth, asyncHandler(async (req, res) => {
  const blogs = await Blog.findAll({
    where: { user_id: req.session.user_id },
    include: User,
  }).map((blog) => blog.get({ plain: true }));

  res.render("dashboard", { blogs, url: req.originalUrl, logged_in: req.session.logged_in });
}));

router.get("/createblog", withAuth, asyncHandler(async (req, res) => {
  const user = await User.findOne({ where: { id: req.session.user_id } }).get({ plain: true });
  res.render("createblog", { user, url: req.originalUrl, logged_in: req.session.logged_in });
}));

router.get("/editblog/:id", withAuth, asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({
    where: { id: req.params.id },
    include: [User, Comment],
  }).get({ plain: true });

  res.render("editblog", { blog, url: req.originalUrl, logged_in: req.session.logged_in });
}));

router.get("/blog/:id", asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({
    where: { id: req.params.id },
    include: [User, Comment],
  }).get({ plain: true });

  const comments = await Comment.findAll({
    where: { blog_id: req.params.id },
    include: [User, Blog],
  }).map((comment) => comment.get({ plain: true }));

  res.render("blog", { blog, comments, logged_in: req.session.logged_in });
}));

router.get("/login", (req, res) => {
  if (req.session.logged_in) {
    return res.redirect("/");
  }
  res.render("login");
});

module.exports = router;
