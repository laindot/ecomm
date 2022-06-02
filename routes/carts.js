const express = require('express');
const cartsRepo = require('../repositories/carts');
const productsRepo = require('../repositories/products');
const cartShowTemplate = require('../views/carts/show');

const router = express.Router();

// receive a post request to add an item to a cart
router.post('/cart/products', async (req, res) => {
  let cart;
  if (!req.session.cartId) {
    // we don't have a cart, we need to create one,
    // and store the id in the req.session.cartId
    // property
    console.log('if true');
    cart = await cartsRepo.create({ items: [] });
    req.session.cartId = cart.Id;
  } else {
    // we have a cart, let's get it from the repository
    console.log('if false');
    cart = await cartsRepo.getOne(req.session.cartId);
  }
  const existingItem = cart.items.find(
    (item) => item.Id === req.body.productId
  );
  console.log(req.body);
  if (existingItem) {
    // increment quantity and save cart
    existingItem.quantity++;
  } else {
    // add new product Id to items array
    cart.items.push({ Id: req.body.productId, quantity: 1 });
  }
  await cartsRepo.update(cart.Id, {
    items: cart.items,
  });
  res.send('Product added to cart');
});

// receive a GET request to show all items in cart
router.get('/cart', async (req, res) => {
  if (!req.session.cartId) {
    return res.redirect('/');
  }

  const cart = await cartsRepo.getOne(req.session.cartId);

  for (let item of cart.items) {
    const product = await productsRepo.getOne(item.Id);
    item.product = product;
  }
  res.send(cartShowTemplate({ items: cart.items }));
});

// receive a post request to delete an item from a cart

module.exports = router;
