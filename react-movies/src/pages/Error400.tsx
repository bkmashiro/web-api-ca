import React from "react";
import { useLocation } from "react-router-dom";

const Error400 = () => {
  let { state } = useLocation();
  const err = state ? state.err : null;
  return (
    <div>
      <h1>400: Bad Request</h1>

      {err && err.message ? (
        <p>{err.message}</p>
      ) : (
        <p>Unknown Error</p>
      )}

    </div>
  );
};

export default Error400;
