import React, { useState } from "react";

export const MoviesContext = React.createContext<any>(null);
type Movie = any;
const MoviesContextProvider = (props) => {
  const [favorites, setFavorites] = useState<Movie>([]);
  const [myReviews, setMyReviews] = useState({});
  const [playList, setPlayList] = useState<Movie>([]);

  const addToFavorites = (movie) => {
    let newFavorites: Movie[] = [];
    if (!favorites.includes(movie.id)) {
      newFavorites = [...favorites, movie.id];
    } else {
      newFavorites = [...favorites];
    }
    setFavorites(newFavorites);
  };

  const addReview = (movie, review) => {
    setMyReviews({ ...myReviews, [movie.id]: review });
  };

  const addMovieToPlayList = (movie) => {
    let newPlayList: Movie[] = [];
    if (!playList.includes(movie.id)) {
      newPlayList = [...playList, movie.id];
    } else {
      newPlayList = [...playList];
    }
    setPlayList(newPlayList);
  };

  // We will use this function in the next step
  const removeFromFavorites = (movie) => {
    setFavorites(favorites.filter((mId) => mId !== movie.id));
  };

  return (
    <MoviesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        addReview,
        myReviews,
        addMovieToPlayList,
        playList,
      }}
    >
      {props.children}
    </MoviesContext.Provider>
  );
};

export default MoviesContextProvider;
