require('dotenv').config();
const express = require('express');
const expressSession = require('express-session');
const massive = require('massive');
const { CONNECTION_STRING, SESSION_SECRET } = process.env;
const { authCtrl } = require('./controllers/authController');

const app = express();

const PORT = 4000;
const AUTH_REGISTER = `/auth/register`;

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

app.listen(PORT, () => console.log(`On Port ${PORT}`));
