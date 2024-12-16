import React, { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";

const NavigationContext = createContext<ReturnType<typeof useNavigate> | null>(
  null
);

export const NavigationProvider = ({ children }) => {
  const navigate = useNavigate();
  return (
    <NavigationContext.Provider value={navigate}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);

export default NavigationContext;