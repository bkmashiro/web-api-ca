import React, { useContext } from "react";
import PageTemplate from "../components/templateMovieListPage";
import { MoviesContext } from "../contexts/moviesContext";
import { useQuery } from "react-query";
import { getMovieNowPlaying } from "../api/tmdb-api";
import Spinner from "../components/spinner";
import RemoveFromFavorites from "../components/cardIcons/removeFromFavorites";
import WriteReview from "../components/cardIcons/writeReview";
import AddToPlayList from "../components/cardIcons/playListAdd";

const NowPlayingMoviesPage = () => {
  // Create an array of queries and run in parallel.
  const upcomingMovieQueries = useQuery<any>(
    "now-playing",
    getMovieNowPlaying
  );
  // Check if any of the parallel queries is still loading.
  // const isLoading = upcomingMovieQueries.find((m) => m.isLoading === true);
  const isLoading = upcomingMovieQueries.isLoading;

  if (isLoading) {
    return <Spinner />;
  }

  const movies = upcomingMovieQueries.data.results;

  return (
    <PageTemplate
      title="Now Playing Movies"
      movies={movies}
      action={(movie) => {
        return (
          <>
            {/* <RemoveFromFavorites movie={movie} />
            <WriteReview movie={movie} /> */}
            <AddToPlayList movie={movie} />
          </>
        );
      }}
    />
  );
};

export default NowPlayingMoviesPage;
