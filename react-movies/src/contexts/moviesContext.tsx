import React, { useState, useEffect, useCallback } from "react";
import {
  getFavorites,
  addFavorites,
  deleteFavorites,
  addReviews,
  getReviews,
  deleteReviews,
} from "../api/local-api";

export const MoviesContext = React.createContext<any>(null);

type Movie = any;

const MoviesContextProvider = (props) => {
  const [favorites, setFavoritesState] = useState<Movie[]>([]);
  const [myReviews, setMyReviews] = useState({});
  const [playList, setPlayList] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data = await getFavorites();
        console.log("data", data);
        setFavoritesState(data || []);
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
      }
    };

    fetchFavorites();
  }, []);

  const addToFavorites = useCallback(
    async (movie) => {
      if (!favorites.includes(movie.id)) {
        const newFavorites = [...favorites, movie.id];
        try {
          await addFavorites(movie.id);
          setFavoritesState(newFavorites);
        } catch (error) {
          console.error("Failed to add favorite:", error);
        }
      }
    },
    [favorites]
  );

  const removeFromFavorites = useCallback(
    async (movie) => {
      const newFavorites = favorites.filter((mId) => mId !== movie.id);
      try {
        await deleteFavorites(movie.id);
        setFavoritesState(newFavorites);
      } catch (error) {
        console.error("Failed to remove favorite:", error);
      }
    },
    [favorites]
  );

  const addReview = (movie, review) => {
    addReviews(movie.id, review)
      .then(() => {
        console.log("review added");
        setMyReviews({ ...myReviews, [movie.id]: review });
      })
      .catch((error) => {
        console.error("Failed to add review:", error);
      });
  };

  const addMovieToPlayList = (movie) => {
    if (!playList.includes(movie.id)) {
      setPlayList((prevPlayList) => [...prevPlayList, movie.id]);
    }
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
