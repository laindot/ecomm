const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const usersRepo = require('./repositories/users');
const users = require('./repositories/users');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    keys: ['lkasld235j'],
  })
);

app.get('/signup', (req, res) => {
  res.send(`
    <div>
      <form method="POST">
      your id is ${req.session.userId}
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
  // crear un usuario en nuestro repo para respresentarlo
  const user = await usersRepo.create({ email, password });

  // guardar el Id del usuario en un cookie
  req.session.userId = user.Id; // propiedad que viene de cookie session
  res.send('account created');
});

app.get('/signout', (req, res) => {
  req.session = null;
  res.send('you are logged out');
});

app.get('/signin', (req, res) => {
  res.send(`
  <div>
    <form method="POST">
      <input name="email" placeholder="email" />
      <input name="password" placeholder="password" />
      <button>Sign In</button>
  </form>
</div>
`);
});

app.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  const user = await usersRepo.getOneBy({ email });

  if (!user) {
    return res.send('Email not found');
  }

  const validPassword = await usersRepo.comparePasswords(
    user.password,
    password
  );

  if (!validPassword) {
    return res.send('Invalid password');
  }

  req.session.userId = user.Id;
  res.send('you are logged in');
});

app.listen(2002, () => {
  console.log('listening');
});
