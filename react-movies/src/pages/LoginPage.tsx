// src/pages/LoginPage.js
import React, { useContext, useState } from "react";
import { login, signup } from "../api/local-api";
import { TextField, Button, Box, Typography } from "@mui/material";
import { UserContext } from "../contexts/userContext";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false); // Toggle between login and register
  const [error, setError] = useState("");
  const { authenticate } = useContext(UserContext);

  const navigate = useNavigate();

  // Email validation using regex
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password strength validation
  const isValidPassword = (password) => {
    // Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number, and one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async () => {
    setError("");

    // Validate email and password before proceeding
    if (!isValidEmail(email)) {
      setError("Invalid email format.");
      return;
    }

    if (!isValidPassword(password)) {
      setError(
        "Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return;
    }

    try {
      if (isRegister) {
        const { code, message } = await signup(email, password);

        if (code !== 201) {
          setError(message);
        } else {
          navigate("/redirect", {
            state: {
              destination: "/login",
              reason: "Redirecting to login page",
            },
          });
        }
      } else {
        const credential = await authenticate(email, password);
        if (credential) {
          navigate("/");
        } else {
          setError("Invalid credentials.");
        }
      }
    } catch (err) {
      console.error(err);
      setError((err as any)?.response?.data?.msg || (err as any).message);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 5,
      }}
    >
      <Typography variant="h4" gutterBottom>
        {isRegister ? "Register" : "Login"}
      </Typography>
      {error && (
        <Typography variant="body1" color="error" gutterBottom>
          {error}
        </Typography>
      )}
      <TextField
        label="Email"
        type="email"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleSubmit}
      >
        {isRegister ? "Sign Up" : "Login"}
      </Button>
      <Button sx={{ mt: 2 }} onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? "Already have an account? Login" : "Create an account"}
      </Button>
    </Box>
  );
};

export default LoginPage;
