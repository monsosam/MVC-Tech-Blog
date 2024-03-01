const router = require('express').Router()
const {Comment} = require('../../models')

const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.use((err, req, res, next) => {
    res.status(400).json({ message: err.message });
});

router.post('/', asyncHandler(async (req, res) => {
    const createComment = await Comment.create({
      ...req.body,
      user_id: req.session.user_id,
    });
    res.status(200).json(createComment);
  }));

module.exports = router
