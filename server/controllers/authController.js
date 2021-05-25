const bcrypt = require('bcryptjs');

async function authCtrl(req, res) {
  const { username, password, isAdmin } = req.body;
  const db = req.app.get('db');
  const result = await db.get_user(username);
  const existingUser = result[0];
  if (existingUser) {
    res.status(409).json('Username is taken!');
  }
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  const registeredUser = await db.register_user(isAdmin, username, hash);
  const user = registeredUser[0];
  req.session.user = {
    isAdmin: user.is_admin,
    id: user.id,
    username: user.username,
  };
  res.status(201).json(user);
}

module.exports = {
  authCtrl,
};
