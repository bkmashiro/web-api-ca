import { UserCredential } from "firebase/auth";
import React, { useState } from "react";

export const UserContext = React.createContext<any>(null);

const UserContextProvider = (props) => {
  const [currentUser, setCurrentUser] = useState<UserCredential | null>(null);

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
