// import { UserCredential } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { login, signup, getUser } from "../api/local-api";

export const UserContext = React.createContext<any>(null);

const UserContextProvider = (props) => {
  const [currentUser, setCurrentUser] = useState<{
    token: string;
    username: string;
    password: string;
  } | null>(null);

  const existingToken = localStorage.getItem("token");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState(existingToken);

  const setToken = (data) => {
    if (!data) {
      localStorage.removeItem("token");
      console.log("removing token");
      setAuthToken(null);
      return;
    }

    localStorage.setItem("token", data);
    setAuthToken(data);
  };

  const authenticate = async (username, password) => {
    const result = await login(username, password);

    if (result.token) {
      setToken(result.token);
      setIsAuthenticated(true);
      const user = await getUser();
      setCurrentUser(user);
    }
  };

  const register = async (username, password) => {
    const result = await signup(username, password);
    console.log(result.code);
    return result.code == 201 ? true : false;
  };

  const signout = () => {
    console.log("signing out");
    setToken(null);
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  // when loaded, try use the existing token to authenticate
  useEffect(() => {
    if (existingToken) {
      // try to authenticate
      try {
        getUser().then((user) => {
          if (user) {
            setIsAuthenticated(true);
            setCurrentUser(user);
          }
        });
      } catch (error) {
        console.error("Failed to authenticate with existing token:", error);
      }
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        authenticate,
        isAuthenticated,
        authToken,
        register,
        signout,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
