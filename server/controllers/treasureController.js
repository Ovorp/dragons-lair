async function dragonTreasure(req, res) {
  const db = req.app.get('db');
  const treasure = await db.get_dragon_treasure(1);
  res.status(200).json(treasure);
}

async function getUserTreasure(req, res) {
  const db = req.app.get('db');
  const userTreasure = await db.get_user_treasure(req.session.user.id);
  res.status(200).json(userTreasure);
}

async function addUserTreasure(req, res) {
  const { treasureURL } = req.body;
  const { id } = req.session.user;
  const db = req.app.get('db');
  const userTreasure = await db.add_user_treasure(treasureURL, id);
  res.status(200).json(userTreasure);
}

async function getAllTreasure(req, res) {
  const db = req.app.get('db');
  const allTreasure = await db.get_all_treasure();
  res.status(200).json(allTreasure);
}

module.exports = {
  dragonTreasure,
  getUserTreasure,
  addUserTreasure,
  getAllTreasure,
};
