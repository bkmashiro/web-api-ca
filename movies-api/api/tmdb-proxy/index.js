import fetch from 'node-fetch';
import asyncHandler from 'express-async-handler';
import express from 'express';

const router = express.Router();

/**
 * Proxy request to TMDB API
 * */

router.get('*', asyncHandler(async (req, res) => {
  const url = `https://api.themoviedb.org/3${req.url.replace('/api/tmdb-proxy/', '')}`;


  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${process.env.TMDB_KEY}`
    }
  });
  const data = await response.json();
  res.json(data);
}));

export default router;