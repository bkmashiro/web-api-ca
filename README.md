# Assignment 2 - Web API.

Name: Yuzhe Shi

## Features.

A bullet-point list of the ADDITIONAL features you have implemented in the API **THAT WERE NOT IN THE LABS** (or modifications to existing features)
 
+ Proxied all TMDb API endpoints to the local server. (So that little modification is needed in the React app)
+ Store user data (User info, liked movies, etc.) locally in the MongoDB database.
+ Swagger API documentation.
+ Cache the TMDb API response (for /movies endpoint) for 5 minutes.
+ Use TypeScript for better type checking and DX.

## Setup requirements.

[ Outline any non-standard setup steps necessary to run your app locally after cloning the repo.]

## API Configuration

Describe any configuration that needs to take place before running the API. For example, creating an `.env` file and what variables to put in it. Give an example of how this might be done.

REMEMBER: DON'T PUT YOUR OWN USERNAMES/PASSWORDS/AUTH KEYS IN THE README OR ON GITHUB, just placeholders as indicated below:

______________________
NODEENV=development
PORT=8080
HOST=
mongoDB=YourMongoURL
seedDb=true
secret=YourJWTSecret
______________________

## API Design
Give an overview of your web API design, perhaps similar to the following: 

- /api/movies | GET | Gets a list of movies 
- /api/movies/{movieid} | GET | Gets a single movie 
- /api/movies/{movieid}/reviews | GET | Get all reviews for movie 
- /api/movies/{movieid}/reviews | POST | Create a new review for Movie 

If you have your API design on an online platform or graphic, please link to it (e.g. [Swaggerhub](https://app.swaggerhub.com/)).

## Security and Authentication

Give details of authentication/security implemented on the API (e.g. passport/sessions). Indicate which routes are protected.

+ use password and username to login, then get a JWT token to access other routes.
+ hash and salt the password before storing it in the database.

Protected API:
+

## Integrating with React App

Describe how you integrated your React app with the API. List the views that use your Web API instead of the TMDB API. Describe any other updates to the React app from Assignment One.

## Independent learning (if relevant)

Briefly explain any non-standard features developed for the app.   

+ Use proxy to delegate all requests originally to TMDB API to the local server.
+ Use Axios to send requests to the local server.


## Future Work

+ Through not used here, but swagger OpenAPI can be exported and use Codegen to generate client code for front-end.