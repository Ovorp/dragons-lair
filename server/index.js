require('dotenv').config();
const express = require('express');
const expressSession = require('express-session');
const massive = require('massive');
const { CONNECTION_STRING, SESSION_SECRET } = process.env;
const { authCtrl, login, logout } = require('./controllers/authController');
const {
  dragonTreasure,
  getUserTreasure,
  addUserTreasure,
  getAllTreasure,
} = require('./controllers/treasureController');
const { userOnly, adminsOnly } = require('./middleware/authMiddleware');

const app = express();

const PORT = 4000;
const AUTH_REGISTER = `/auth/register`;
const AUTH_LOGIN = `/auth/login`;
const AUTH_LOGOUT = `/auth/logout`;
const API_TREASURE = `/api/treasure`;

app.use(
  expressSession({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);
app.use(express.json());

massive({
  connectionString: CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false,
  },
})
  .then((dbInstance) => {
    app.set('db', dbInstance);
    console.log('database set up');
  })
  .catch((err) => console.log(err));

app.post(AUTH_REGISTER, authCtrl);

app.post(AUTH_LOGIN, login);

app.get(AUTH_LOGOUT, logout);

app.get(`${API_TREASURE}/dragon`, dragonTreasure);

app.get(`${API_TREASURE}/user`, userOnly, getUserTreasure);

app.post(`${API_TREASURE}/user`, userOnly, addUserTreasure);

app.get(`${API_TREASURE}/all`, userOnly, adminsOnly, getAllTreasure);

app.listen(PORT, () => console.log(`On Port ${PORT}`));
