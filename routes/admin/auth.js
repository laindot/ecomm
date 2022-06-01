const express = require('express');
const usersRepo = require('../../repositories/users');
const { handleErrors } = require('./middlewares');

const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const {
  requireEmail,
  requirePassword,
  requirePasswordConfirmation,
  requireEmailExists,
  requireValidPassword,
} = require('./validators.js');

const router = express.Router();

router.get('/signup', (req, res) => {
  res.send(signupTemplate({ req }));
});

router.post(
  '/signup',
  [requireEmail, requirePassword, requirePasswordConfirmation],
  handleErrors(signupTemplate),
  async (req, res) => {
    const { email, password } = req.body;

    // crear un usuario en nuestro repo para respresentarlo
    const user = await usersRepo.create({ email, password });

    // guardar el Id del usuario en un cookie
    req.session.userId = user.Id; // propiedad que viene de cookie session
    res.redirect('/admin/products');
  }
);

router.get('/signout', (req, res) => {
  req.session = null;
  res.send('you are logged out');
});

router.get('/signin', (req, res) => {
  res.send(signinTemplate({}));
});

router.post(
  '/signin',
  [requireEmailExists, requireValidPassword],
  handleErrors(signinTemplate),
  async (req, res) => {
    const { email } = req.body;

    const user = await usersRepo.getOneBy({ email });

    req.session.userId = user.Id;
    res.redirect('/admin/products');
  }
);

module.exports = router;
