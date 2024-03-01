const router = require('express').Router();
const { User } = require('../../models');

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.use((err, req, res, next) => {
  res.status(400).json({ message: err.message });
});

const saveSession = (req, userData, extraSessionData = {}) => {
  req.session.save(() => {
    req.session.user_id = userData.id;
    req.session.logged_in = true;
    Object.assign(req.session, extraSessionData); // Merge any extra session data
  });
};

router.post('/', asyncHandler(async (req, res) => {
  const userData = await User.create(req.body);
  saveSession(req, userData);
  res.status(200).json(userData);
}));

router.post('/login', asyncHandler(async (req, res) => {
  const userData = await User.findOne({ where: { email: req.body.email } });
  if (!userData || !(await userData.checkPassword(req.body.password))) {
    throw new Error('Incorrect email or password, please try again');
  }

  saveSession(req, userData, { email: userData.email });
  res.json({ user: userData, message: 'You are now logged in!' });
}));

router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
