import { UserCredential } from "firebase/auth";
import React, { useState } from "react";
import { login, signup } from "../api/local-api";

export const UserContext = React.createContext<any>(null);

const UserContextProvider = (props) => {
  const [currentUser, setCurrentUser] = useState<UserCredential | null>(null);

  const existingToken = localStorage.getItem("token");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState(existingToken);

  const setToken = (data) => {
    localStorage.setItem("token", data);
    setAuthToken(data);
  };

  const authenticate = async (username, password) => {
    const result = await login(username, password);

    if (result.token) {
      setToken(result.token);
      setIsAuthenticated(true);
    }
  };

  const register = async (username, password) => {
    const result = await signup(username, password);
    console.log(result.code);
    return result.code == 201 ? true : false;
  };

  const signout = () => {
    setTimeout(() => setIsAuthenticated(false), 100);
  };

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
