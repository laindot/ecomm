const usersRepo = require('../../repositories/users');
const express = require('express');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');

const router = express.Router();

router.get('/signup', (req, res) => {
  res.send(signupTemplate({ req }));
});

router.post('/signup', async (req, res) => {
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

router.get('/signout', (req, res) => {
  req.session = null;
  res.send('you are logged out');
});

router.get('/signin', (req, res) => {
  res.send(signinTemplate());
});

router.post('/signin', async (req, res) => {
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

module.exports = router;
