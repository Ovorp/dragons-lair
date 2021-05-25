const bcrypt = require('bcryptjs');

async function authCtrl(req, res) {
  const { username, password, isAdmin } = req.body;

  const db = req.app.get('db');
  const result = await db.get_user(username);
  const existingUser = result[0];
  if (existingUser) {
    res.status(409).json('Username is taken!');
  }
  const salt = await bcrypt.genSaltSync(10);
  const hash = await bcrypt.hashSync(password, salt);
  const registeredUser = await db.register_user(isAdmin, username, hash);
  const user = registeredUser[0];
  req.session.user = {
    isAdmin: user.is_admin,
    id: user.id,
    username: user.username,
  };
  res.status(201).json(req.session.user);
}

async function login(req, res) {
  const { username, password } = req.body;
  const db = req.app.get('db');
  const foundUser = await db.get_user(username);
  const user = foundUser[0];
  if (!user) {
    res.status(401).json('User not found');
  }
  const isAuthenticated = bcrypt.compareSync(password, user.hash);
  if (!isAuthenticated) {
    res.status(403).json('Incorrect password');
  }
  req.session.user = {
    isAdmin: user.is_admin,
    id: user.id,
    username: user.username,
  };
  res.status(200).json(req.session.user);
}

async function logout(req, res) {
  req.session.destroy();
  res.status(200).json('Logged out');
}

module.exports = {
  login,
  logout,
  authCtrl,
};
