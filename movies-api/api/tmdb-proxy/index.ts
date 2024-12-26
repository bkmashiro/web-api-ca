import fetch from "node-fetch";
import asyncHandler from "express-async-handler";
import express from "express";
import Movie from "../movies/movieModel";

const router = express.Router();

// caches
const handlers = [
  {
    // e.g. movie/912649, but not movie/912649/reviews
    pattern: /^\/movie\/(\d+)$/,
    ttl: 600,
    fetch: async (url) => {
      console.log("fetch", url, `https://api.themoviedb.org/3${url}`);
      const response = await fetch(`https://api.themoviedb.org/3${url}`, {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_KEY}`,
        },
      });
      return await response.json();
    },

    key(url): string {
      return this.pattern.exec(url)?.[1]!;
    },

    async get(url, ctx) {
      const key = this.key(url);

      // check ttl
      const cache = ctx.cache.get(key);
      if (cache && cache.expiry < Date.now()) {
        console.log("[cached] ", key);
        return cache.value;
      }

      // fetch and cache
      const value = await this.fetch(url);

      const movie = await Movie.findOneAndUpdate({ id: value.id }, value, {
        upsert: true,
      });
      // console.log("movie set", movie);
      ctx.cache.set(key, {
        value: movie,
        expiry: Date.now() + this.ttl,
      });

      return value;
    },

    async destory(url, ctx) {
      const key = this.key(url);
      ctx.cache.delete(key);
      Movie.deleteOne({ id: key });
    },

    init(ctx) {
      ctx.cache = new Map();
    },

    // clear all expired cache
    refresh(ctx) {
      const now = Date.now();
      for (const [key, cache] of ctx.cache) {
        if (cache.expiry < now) {
          this.destory(key, ctx);
        }
      }
    },
  },
];

// cache some reques to mongodb
class TMDbCache {
  handlers = new Map();

  register(handler) {
    this.handlers.set(handler, new Map());

    handler.init(this.handlers.get(handler));
  }

  constructor() {
    handlers.forEach((handler) => {
      this.register(handler);
    });

    setInterval(() => {
      for (const handler of this.handlers.keys()) {
        handler.refresh(this.handlers.get(handler));
      }
    }, 10000);
  }

  get(url: string) {
    for (const [handler, ctx] of this.handlers) {
      if (handler.pattern.test(url)) {
        console.log("[query]  ", url);
        return handler.get(url, ctx);
      }
    }

    console.log("[fallback] ", url);
    // fallback
    return fetch(
      `https://api.themoviedb.org/3${url.replace("api/tmdb-proxy", "")}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_KEY}`,
        },
      }
    ).then((response) => response.json());
  }
}

/**
 * Proxy request to TMDB API
 * */
const cache = new TMDbCache();

/**
 * @openapi
 * /tmdb-proxy:
 *  get:
 *   description: Proxy request to TMDB API
 * */
router.get(
  "*",
  asyncHandler(async (req, res) => {
    const data = await cache.get(req.url);
    res.json(data);
  })
);

/**
 * @openapi
 * /tmdb-proxy:
 *  post:
 *   description: Proxy request to TMDB API
 * */
router.post(
  "*",
  asyncHandler(async (req, res) => {
    const data = await fetch(`https://api.themoviedb.org/3${req.url}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.TMDB_KEY}`,
      },
      body: req.body,
    })

    res.json(await data.json());
  })
);

export default router;
