const router = require('express').Router()
const { Blog } = require('../../models');


const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ message: err.message });
});

router.post('/', asyncHandler(async (req, res) => {
  const createBlog = await Blog.create({
    ...req.body,
    user_id: req.session.user_id,
  });
  res.status(200).json(createBlog);
}));

router.put('/:id', asyncHandler(async (req, res) => {
  const updateBlog = await Blog.update(req.body, {
    where: {
      id: req.params.id,
    },
  });
  if (updateBlog[0] === 0) throw new Error('Blog not found or no permission to update');
  res.status(200).json(updateBlog);
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  const deleteBlog = await Blog.destroy({
    where: {
      id: req.params.id,
      user_id: req.session.user_id,
    },
  });
  if (deleteBlog === 0) throw new Error('Blog not found or no permission to delete');
  res.status(200).json(deleteBlog);
}));

module.exports = router