// src/pages/LogoutPage.tsx
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../api/firebase";
import { signOut } from "firebase/auth";
import { CircularProgress, Box, Typography } from "@mui/material";
import { UserContext } from "../contexts/userContext";

const LogoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(UserContext);
  useEffect(() => {
    const logout = async () => {
      try {
        await signOut(auth);
        setCurrentUser(null); // Clear the current user
        navigate("/"); // Redirect to home page after logout
      } catch (error) {
        console.error("Error logging out:", error);
        navigate("/"); // Still navigate to home in case of error
      }
    };

    logout();
  }, [navigate]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <CircularProgress />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Logging out...
      </Typography>
    </Box>
  );
};

export default LogoutPage;
