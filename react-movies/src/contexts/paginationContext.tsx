import React, { useState } from "react";

export const PaginationContext = React.createContext<any>(null);

const PaginationContextProvider = (props) => {
  const [currentPage, setCurrentPage] = useState(1);

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const nextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  return (
    <PaginationContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        prevPage,
        nextPage,
      }}
    >
      {props.children}
    </PaginationContext.Provider>
  );
};

export default PaginationContextProvider;
