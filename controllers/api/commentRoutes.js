const router = require("express").Router();
const { User, Comment, Post } = require("../../models/");
const withAuth = require("../../utils/auth");

router.get("/", async (req, res) => {
  try {
    const commentData = await Comment.findAll({
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });

    const comments = commentData.map((comment) => comment.get({ plain: true }));

    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.post("/:post_id", withAuth, async (req, res) => {
  console.log(req.body);
  try {
    const newComment = await Comment.create({
      ...req.body,
      user_id: req.session.user_id,
      post_id: req.params.post_id,
    });

    res.status(200).json(newComment);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

module.exports = router;
