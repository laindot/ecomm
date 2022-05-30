const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const usersRepo = require('./repositories/users');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    keys: ['23jk4h2k34hk3nr'],
  })
);

app.get('/signup', (req, res) => {
  res.send(`
    <div>
      <form method="POST">
        <input name="email" placeholder="email" />
        <input name="password" placeholder="password" />
        <input name="passwordConfirmation" placeholder="confirm password" />
        <button>Sign Up</button>
      </form>
    </div>
  `);
});

app.post('/signup', async (req, res) => {
  const { email, password, passwordConfirmation } = req.body;
  const existingUser = await usersRepo.getOneBy({ email });

  if (existingUser) {
    return res.send('Email in use');
  }
  if (password !== passwordConfirmation) {
    return res.send('Passwords must match');
  }

  app.get('/signout', (req, res) => {
    req.session = null;
  });

  app.get('/signin', (req, res) => {
    res.send(`
    <div>
      <form method="POST">
        <input name="email" placeholder="email" />
        <input name="password" placeholder="password" />
        <button>Sign Up</button>
    </form>
  </div>
  `);
  });

  // crear un usuario en nuestro repo para respresentarlo
  await usersRepo.create({ email, password });

  // guardar el Id del usuario en un cookie
  req.session.userId = user.Id; // propiedad que viene de cookie session
});

app.listen(2002, () => {
  console.log('listening');
});
