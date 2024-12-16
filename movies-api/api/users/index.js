import express from 'express';
import User from './userModel';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import authenticate from '../../authenticate';

async function registerUser(req, res) {
  // if exists, return 409 error
  if (await User.findByUserName(req.body.username)) {
    return res.status(409).json({ success: false, msg: 'Username already exists.' });
  }

  // Add input validation logic here
  await User.create(req.body);
  res.status(201).json({ success: true, msg: 'User successfully created.' });
}

async function authenticateUser(req, res) {
  const user = await User.findByUserName(req.body.username);
  if (!user) {
    return res.status(401).json({ success: false, msg: 'Authentication failed. User not found.' });
  }

  const isMatch = await user.comparePassword(req.body.password);
  if (isMatch) {
    const token = jwt.sign({ username: user.username }, process.env.SECRET);
    res.status(200).json({ success: true, token: 'BEARER ' + token });
  } else {
    res.status(401).json({ success: false, msg: 'Wrong password.' });
  }
}

const router = express.Router(); // eslint-disable-line

// Get all users
/**
 * @openapi
 * /api/users:
 *  get:
 *   tags:
 *    - users
 *  summary: Returns all users
 * description: Retrieve a paginated list of all users.
 * 
 * responses:
 *   200:
 *    description: A list of users.
 */
router.get('/', async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

router.get('/profile', authenticate, async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, msg: 'Unauthorized.' });
  }

  const user = await User.findByUserName(req.user.username);

  if (!user) {
    return res.status(404).json({ success: false, msg: 'User not found.' });
  }

  res.status(200).json(user);
});

// register(Create)/Authenticate User
router.post('/', asyncHandler(async (req, res) => {
  try {
    if (!req.body.username || !req.body.password) {
      return res.status(400).json({ success: false, msg: 'Username and password are required.' });
    }
    if (req.query.action === 'register') {
      await registerUser(req, res);
    } else {
      await authenticateUser(req, res);
    }
  } catch (error) {
    // Log the error and return a generic error message
    console.error(error);
    res.status(500).json({ success: false, msg: 'Internal server error.' });
  }
}));

// register(Create)/Authenticate User
router.post('/', async (req, res) => {
  if (req.query.action === 'register') {  //if action is 'register' then save to DB
    await User(req.body).save();
    res.status(201).json({
      code: 201,
      msg: 'Successful created new user.',
    });
  }
  else {  //Must be an authenticate then!!! Query the DB and check if there's a match
    const user = await User.findOne(req.body);
    if (!user) {
      return res.status(401).json({ code: 401, msg: 'Authentication failed' });
    } else {
      return res.status(200).json({ code: 200, msg: "Authentication Successful", token: 'TEMPORARY_TOKEN' });
    }
  }
});

// Update a user
router.put('/:id', async (req, res) => {
  if (req.body._id) delete req.body._id;
  const result = await User.updateOne({
    _id: req.params.id,
  }, req.body);
  if (result.matchedCount) {
    res.status(200).json({ code: 200, msg: 'User Updated Sucessfully' });
  } else {
    res.status(404).json({ code: 404, msg: 'Unable to Update User' });
  }
});

// Delete a user
router.delete('/:id', async (req, res) => {
  const result = await User.deleteOne({ _id: req.params.id });
  if (result.deletedCount) {
    res.status(200).json({ code: 200, msg: 'User Deleted Sucessfully' });
  } else {
    res.status(404).json({ code: 404, msg: 'Unable to Delete User' });
  }
});

// Favorite a movie
router.post('/:username/favorites', async (req, res) => {
  const user = await User.findByUserName(req.params.username);
  if (!user) {
    return res.status(404).json({ code: 404, msg: 'User not found.' });
  }
  user.favorites.push(req.body);
  await user.save();
  res.status(201).json({ code: 201, msg: 'Movie added to favorites.' });
});

// Get all favorites
router.get('/:username/favorites', async (req, res) => {
  const user = await User.findByUserName(req.params.username);
  if (!user) {
    return res.status(404).json({ code: 404, msg: 'User not found.' });
  }
  res.status(200).json(user.favorites);
});

// Delete a favorite
router.delete('/:username/favorites/:id', async (req, res) => {
  const user = await User.findByUserName(req.params.username);
  if (!user) {
    return res.status(404).json({ code: 404, msg: 'User not found.' });
  }
  user.favorites.pull({ _id: req.params.id });
  await user.save();
  res.status(200).json({ code: 200, msg: 'Movie removed from favorites.' });
});

// Get all reviews
router.get('/:username/reviews', async (req, res) => {
  const user = await User.findByUserName(req.params.username);
  if (!user) {
    return res.status(404).json({ code: 404, msg: 'User not found.' });
  }
  res.status(200).json(user.reviews);
});

// Delete a review
router.delete('/:username/reviews/:id', async (req, res) => {
  const user = await User.findByUserName(req.params.username);
  if (!user) {
    return res.status(404).json({ code: 404, msg: 'User not found.' });
  }
  user.reviews.pull({ _id: req.params.id });
  await user.save();
  res.status(200).json({ code: 200, msg: 'Review removed.' });
});

// Add a review
router.post('/:username/reviews', async (req, res) => {
  const user = await User.findByUserName(req.params.username);
  if (!user) {
    return res.status(404).json({ code: 404, msg: 'User not found.' });
  }
  user.reviews.push(req.body);
  await user.save();
  res.status(201).json({ code: 201, msg: 'Review added.' });
});

// Get a user by username
router.get('/:username', async (req, res) => {
  const user = await User.findByUserName(req.params.username);
  if (!user) {
    return res.status(404).json({ code: 404, msg: 'User not found.' });
  }
  res.status(200).json(user);
});

export default router;