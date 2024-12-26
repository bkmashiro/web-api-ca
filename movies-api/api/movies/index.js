import movieModel from './movieModel';
import asyncHandler from 'express-async-handler';
import express from 'express';
import {
  getUpcomingMovies
} from '../tmdb-api';

const router = express.Router();

/**
 * @openapi
 * /api/movies:
 *   get:
 *     tags:
 *       - movies
 *     summary: Returns all movies
 *     description: Retrieve a paginated list of all movies.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: The number of items per page
 *     responses:
 *       200:
 *         description: A JSON object containing a list of movies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 total_pages:
 *                   type: integer
 *                   example: 10
 *                 total_results:
 *                   type: integer
 *                   example: 100
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                         example: "Movie Title"
 *                       year:
 *                         type: integer
 *                         example: 2024
 */
router.get('/', asyncHandler(async (req, res) => {
  let { page = 1, limit = 10 } = req.query; // destructure page and limit and set default values
  [page, limit] = [+page, +limit]; //trick to convert to numeric (req.query will contain string values)

  // Parallel execution of counting movies and getting movies using movieModel
  const [total_results, results] = await Promise.all([
    movieModel.estimatedDocumentCount(),
    movieModel.find().limit(limit).skip((page - 1) * limit)
  ]);
  const total_pages = Math.ceil(total_results / limit); //Calculate total number of pages (= total No Docs/Number of docs per page) 

  //construct return Object and insert into response object
  const returnObject = {
    page,
    total_pages,
    total_results,
    results
  };
  res.status(200).json(returnObject);
}));

/**
 * @openapi
 * /api/movies/{id}:
 *  get:
 *   tags:
 *    - movies
 *  summary: Get a movie by ID
 * description: Retrieve a movie by ID.
 * */
router.get('/:id', asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  const movie = await movieModel.findByMovieDBId(id);
  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(404).json({ message: 'The movie you requested could not be found.', status_code: 404 });
  }
}));


/**
 * @openapi
 * /tmdb/upcoming:
 *  get:
 *   tags:
 *    - movies
 *  summary: Get upcoming movies
 * description: Retrieve a list of upcoming movies.
 * */
router.get('/tmdb/upcoming', asyncHandler(async (req, res) => {
  const upcomingMovies = await getUpcomingMovies();
  res.status(200).json(upcomingMovies);
}));

/**
 * @openapi
 * /tmdb/genres:
 *  get:
 *   tags:
 *    - movies
 *  summary: Get genres
 * description: Retrieve a list of genres.
 * */
router.get('/tmdb/genres', asyncHandler(async (req, res) => {
  const genres = await movieModel.distinct("genres", {});
  res.status(200).json(genres);
}));

export default router;