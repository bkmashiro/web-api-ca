import axios from "axios";
import { history } from "../history";

const http = axios.create({
  baseURL: "http://localhost:8080/api/tmdb-proxy",
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

http.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error("Error from TMDB API", error);
    console.error("Error status", error.status);
    if (error.status === 401 || error.status === 403) {
      const urlSafeReason = encodeURIComponent(
        "Your session has expired. Please log in again."
      );
      history.push(`/redirect?destination=/login&reason=${urlSafeReason}`);

      window.location.reload();
    }
    return Promise.reject(error);
  }
);

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
