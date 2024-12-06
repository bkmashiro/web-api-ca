# Assignment 1 - ReactJS app.

Name: Yuzhe Shi

Student ID: 20108862

[a@shiyuzhe.com](mailto:a@shiyuzhe.com)

[wsdapp@yuzhes.com](mailto:wsdapp@yuzhes.com)

[20108862@mail.wit.ie](mailto:20108862@mail.wit.ie)

## Overview.

<!-- [A brief statement on the content of this repository.] -->

This is a ReactJS app that uses The Movie Database (TMDb) API to display movie information. It supports features like movie details, pagination, person details, advanced search(filtering & sorting), error page, 404 page, login/logout, now playing movies, continuous deployment, and CDN.

### Features.

<!-- [ A bullet-point list of the __new features__ you added to the Movies Fan app (and any modifications to existing features) .] -->

- Movie Details Page
  - Show links to staff details page.
- Pagination
  - Home page supports pagination.
- Person Details Page
  - Show person details.
- Search
  - allow search by date and rating.
  - allow sort by date and rating.
  - support multiple filters and sorting using pipeline pattern.
- Error Page
  - Show error message.
- 404 Page
  - Show 404 message.
- Login/Logout
  - based on firebase.
  - Example User:
    - email: `a@yuzhes.com`
    - password: `P@ssw0rd`
- Profle
  - Show user's details.
- Now Playing Movies
  - Show now playing movies.
- Continious Deployment
  - Deployed to Vercel.
  - [wad-movie-demo.yuzhes.com](https://wad-movie-demo.yuzhes.com/)
  - [wad-react-project.vercel.app](https://wad-react-project.vercel.app/) (same as above)
- CDN
  - Accelerated by Cloudflare.

## Setup requirements.

```bash
# if you don't have pnpm installed, you can install it by running the following command.
npm i -g pnpm

# install dependencies
pnpm install

# start the app
pnpm dev
```

## API endpoints.

<!-- [ List the __additional__ TMDB endpoints used, giving the description and pathname for each one.] -->

- Now Playing Movies - /movie/now_playing
- Similar Movies - /movie/:id/similar
- movie credits - /movie/:id/credits
- person credits - /person/:id/credits
- person details - /person/:id
- person images - /person/:id/images
- person tv credits - /person/:id/credits
- recommendations - /movie/:id/recommendations
- credits - /movie/:id/credits
<!-- e.g.


- Discover list of movies - discover/movie
- Movie details - movie/:id
- Movie genres = /genre/movie/list -->

## Routing.

[ List the __new routes__ supported by your app and state the associated page.]

- /movies/nowplaying - Now Playing Movies
<!-- - /movies/:id/recommendations - Recommendations -->
- /movies/:id/credits - Credits
- /person/:id - Person Details
- /error - Error Page
- /\* - 404 Page fallback
- /login - Login Page
- /logout - Logout
- /profile - /profile (this is a protected endpoint)
<!-- - /blogs - displays all published blogs.
- /blogs/:id - displays a particular blog.
- /blogs/:id/comments - detail view of a particular blog and its comments.
- etc. -->

[If relevant, state what aspects of your app are protected (i.e. require authentication) and what is public.]

## Independent learning (If relevant).

<!-- Itemize the technologies/techniques you researched independently and adopted in your project,
i.e. aspects not covered in the lectures/labs. Include the source code filenames that illustrate these
(we do not require code excerpts) and provide references to the online resources that helped you (articles/blogs). -->

- Use `pnpm` as package manager.
  - `pnpm-lock.yaml`
  - ref: [pnpm](https://pnpm.io/)
- Use TypeScript to enforce type checking.
  - `tsconfig.json` and all `.ts | .tsx` files.
  - ref: [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
  - ref: [My blog post](https://blog.yuzhes.com/posts/typescript/easy-series.html) (I've been using TypeScript for years. Blog is originally Chinese but TypeScript related posts are mostly bilingual.)
- Refactor the search using pipeline pattern, which allows us flexibly add more filters in the future.
  - `src/components/templateMovieListPage/index.tsx`
  - This pattern is also used in movie sorting. `src/components/filterMoviesCard/index.jsx`
- Use firebase for authentication.
  - `src/pages/loginPage.tsx`
  - `src/pages/logoutPage.tsx`
  - ref: [Firebase](https://firebase.google.com/)
- Use Vercel for continuous deployment.
  - ref: [Vercel](https://vercel.com/)
- Use Cloudflare for CDN.
  - ref: [Cloudflare](https://www.cloudflare.com/)
