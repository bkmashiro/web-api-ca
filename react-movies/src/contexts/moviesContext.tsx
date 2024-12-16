import React, { useState, useEffect, useCallback } from "react";
import { getFavorites, setFavorites, deleteFavorites } from "../api/local-api";

export const MoviesContext = React.createContext<any>(null);

type Movie = any;

const MoviesContextProvider = (props) => {
  const [favorites, setFavoritesState] = useState<Movie[]>([]);
  const [myReviews, setMyReviews] = useState({});
  const [playList, setPlayList] = useState<Movie[]>([]);

  // 从后端加载初始状态
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

  // 添加到收藏
  const addToFavorites = useCallback(
    async (movie) => {
      if (!favorites.includes(movie.id)) {
        const newFavorites = [...favorites, movie.id];
        try {
          await setFavorites(movie.id);
          setFavoritesState(newFavorites);
        } catch (error) {
          console.error("Failed to add favorite:", error);
        }
      }
    },
    [favorites]
  );

  // 从收藏移除
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
    setMyReviews({ ...myReviews, [movie.id]: review });
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
