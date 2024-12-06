import axios from "axios";

const http = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: process.env.REACT_APP_TMDB_KEY,
  },
});

http.interceptors.response.use((response) => {
  return response.data;
});

export const getMovies = (page = 1) => {
  return http.get(`/discover/movie`, {
    params: {
      language: "en-US",
      include_adult: false,
      include_video: false,
      page,
    },
  });
};

export const getMovie = async ({ queryKey: [, idPart] }) => {
  const { id } = idPart;

  return http.get(`/movie/${id}`);
};

export const getUpcomingMovies = ({ page = 1 }) => {
  return http.get(`/movie/upcoming`, {
    params: {
      language: "en-US",
      page: page,
    },
  });
}

export const getGenres = () => {
  return http.get(`/genre/movie/list`, {
    params: {
      language: "en-US",
    },
  });
};

export const getMovieImages = (id) => {
  return http.get(`/movie/${id}/images`);
};

export const getMovieReviews = (id) => {
  return http.get(`/movie/${id}/reviews`);
};

export const getMovieNowPlaying = async () => {
  return await http.get(`/movie/now_playing`);
};

export const getSimilarMovies = async (movieId) => {
  return await http.get(`/movie/${movieId}/similar`);
}

export const getPersonDetails = async (personId) => {
  return await http.get(`/person/${personId}`);
}

export const getPersonImages = async (personId) => {
  return await http.get(`/person/${personId}/images`);
}

export const getPersonMovieCredits = async (personId) => {
  return await http.get(`/person/${personId}/movie_credits`);
}

export const getPersonTvCredits = async (personId) => {
  return await http.get(`/person/${personId}/tv_credits`);
}

export const getMovieRecommendations = async (movieId) => {
  return await http.get(`/movie/${movieId}/recommendations`);
}

export const getMovieCredits = async (movieId) => {
  return await http.get(`/movie/${movieId}/credits`);
}
