import axios from "axios";
import { history } from "../history";

const http = axios.create({
  baseURL: "http://localhost:8080/api",
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
    // console.error("Error from TMDB API", error);
    // console.error("Error status", error.status);
    if (error.status === 401 || error.status === 403) {
      history.push("/login");
    }
    return Promise.reject(error);
  }
);

export const login = async (username, password) => {
  return await http.post<
    any,
    {
      token: string;
      username: string;
      password: string;
    }
  >("/users", {
    username,
    password,
    action: "login",
  });
};

export const signup = async (username, password) => {
  return await http.post<
    {
      username: string;
      password: string;
    },
    {
      code: number;
      message: string;
    }
  >(
    "/users",
    {
      username,
      password,
    },
    {
      params: {
        action: "register",
      },
    }
  );
};

export const getUser = async () => {
  return await http.get<
    {},
    {
      username: string;
      password: string;
      token: string;
    }
  >("/users/profile");
};

export const getFavorites = async () => {
  return await http.get<{}, any>(`/users/favorites`);
};

export const addFavorites = async (movieId) => {
  return await http.post<{}, any>(`/users/favorites`, { movieId });
};

export const deleteFavorites = async (movieId) => {
  return await http.post<{}, any>(`/users/favorites`, {
    movieId,
    action: "delete",
  });
};

export const getReviews = async () => {
  return await http.get<{}, any>(`/users/reviews`);
};

export const getReview = async (movieId) => {
  return await http.get<{}, any>(`/users/reviews/${movieId}`);
}

export const addReviews = async (movieId, review) => {
  return await http.post<{}, any>(`/users/reviews`, { movieId, review });
};

export const deleteReviews = async (movieId) => {
  return await http.delete<{}, any>(`/users/reviews/${movieId}`);
};