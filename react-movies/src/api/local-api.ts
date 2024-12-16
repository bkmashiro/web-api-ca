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
