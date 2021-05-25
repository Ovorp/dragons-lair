function userOnly(req, res, next) {
  if (req.session.user) {
    return next();
  }

  res.status(401).json('Please log in');
}

function adminsOnly(req, res, next) {
  if (req.session.user.isAdmin) {
    return next();
  }
  res.status(403).json('You are not an admin');
}

module.exports = {
  userOnly,
  adminsOnly,
};
