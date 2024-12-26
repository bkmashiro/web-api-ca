import express from 'express';
import User from './userModel';
import Review from '../reviews/reviewModel';
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
 */
router.get('/', async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

/**
 * @openapi
 * /api/users/profile:
 * get:
 * tags:
 * - users
 * summary: Returns the user profile
 * description: Retrieve the profile of the currently authenticated user.
 */
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
/** 
 * @openapi
 * /api/users:
 *  post:
 *   tags:
 *    - users
 *   summary: Register or authenticate a user
 *   description: Register a new user or authenticate an existing user.
 */
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
// router.post('/', async (req, res) => {
//   if (req.query.action === 'register') {  //if action is 'register' then save to DB
//     await User(req.body).save();
//     res.status(201).json({
//       code: 201,
//       msg: 'Successful created new user.',
//     });
//   }
//   else {  //Must be an authenticate then!!! Query the DB and check if there's a match
//     const user = await User.findOne(req.body);
//     if (!user) {
//       return res.status(401).json({ code: 401, msg: 'Authentication failed' });
//     } else {
//       return res.status(200).json({ code: 200, msg: "Authentication Successful", token: 'TEMPORARY_TOKEN' });
//     }
//   }
// });

// Update a user
/** 
 * @openapi
 * /api/users/{id}:
 *  put:
 *   tags:
 *    - users
 *   summary: Update a user
 *   description: Update a user by ID.
 */
router.put('/:id', authenticate, async (req, res) => {
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
router.delete('/:id', authenticate, async (req, res) => {
  const result = await User.deleteOne({ _id: req.params.id });
  if (result.deletedCount) {
    res.status(200).json({ code: 200, msg: 'User Deleted Sucessfully' });
  } else {
    res.status(404).json({ code: 404, msg: 'Unable to Delete User' });
  }
});

// Favorite a movie
router.post('/favorites', authenticate, async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(404).json({ code: 404, msg: 'User not found.' });
  }

  if (!user.favouriteMovies) user.favouriteMovies = [];


  if (req.body.action === 'delete') {
    user.favouriteMovies = user.favouriteMovies.filter((movieId) => movieId !== req.body.movieId);
    await user.save();
    res.status(200).json({ code: 200, msg: 'Movie removed from favorites.' });
  } else {
    user.favouriteMovies.push(req.body.movieId);
    await user.save();
    res.status(201).json({ code: 201, msg: 'Movie added to favorites.' });
  }
});

// Get all favorites
/** 
 * @openapi
 * /api/users/favorites:
 *  get:
 *   tags:
 *    - users
 *   summary: Get all favorites
 *   description: Retrieve a list of all favorite movies.
 */
router.get('/favorites', authenticate, async (req, res) => {
  const user = req.user;
  console.log(req.body.movieId)

  if (!user) {
    return res.status(404).json({ code: 404, msg: 'User not found.' });
  }
  console.log(`getting favorites: ${user.favouriteMovies}`);
  res.status(200).json(user.favouriteMovies);
});


// Get all reviews
/** 
 * @openapi
 * /api/users/reviews:
 *  get:
 *   tags:
 *    - users
 *   summary: Get all reviews
 *   description: Retrieve a list of all reviews.
 */
router.get('/reviews', authenticate, async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(404).json({ code: 404, msg: 'User not found.' });
  }
  res.status(200).json(user.reviews);
});

/** 
 * @openapi
 * /api/users/reviews/{id}:
 *  get:
 *   tags:
 *    - users
 *   summary: Get a review by ID
 *   description: Retrieve a review by ID.
 */
router.get('/reviews/:id', authenticate, async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(404).json({ code: 404, msg: 'User not found.' });
  }

  const review = await Review.findOne({ _id: req.params.id }).exec();
  if (!review) {
    return res.status(404).json({ code: 404, msg: 'Review not found.' });
  }

  res.status(200).json(review);
});

// Delete a review
router.delete('/reviews/:id', authenticate, async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(404).json({ code: 404, msg: 'User not found.' });
  }

  user.reviews = user.reviews.filter((review) => review !== req.params.id);
  await Review.deleteOne({ _id: req.params.id }).exec();

  await user.save();
  res.status(200).json({ code: 200, msg: 'Review removed.' });
});

// Add a review
router.post('/reviews', authenticate, async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(404).json({ code: 404, msg: 'User not found.' });
  }

  const { movieId: mid, review: { review: content, movieId, author, rating } } = req.body;

  if (!movieId || !content) {
    return res.status(400).json({ code: 400, msg: 'Movie ID and review are required.' });
  }

  if (!user.reviews) user.reviews = [];

  const newReview = await Review.create({ user: user._id, author, movieId, content, rating: rating, date: new Date() });
  user.reviews.push(newReview._id);

  await user.save();
  res.status(201).json({ code: 201, msg: 'Review added.' });
});

export default router;