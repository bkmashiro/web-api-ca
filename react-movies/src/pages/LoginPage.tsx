// src/pages/LoginPage.js
import React, { useContext, useState } from "react";
import { auth } from "../api/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { TextField, Button, Box, Typography } from "@mui/material";
import { UserContext } from "../contexts/userContext";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false); // Toggle between login and register
  const [error, setError] = useState("");
  const { setCurrentUser } = useContext(UserContext);

  const navigate = useNavigate();
  const handleSubmit = async () => {
    setError("");
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Account created successfully!");
      } else {
        const credential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        setCurrentUser(credential);

        alert("Logged in successfully!");

        navigate("/");
      }
    } catch (err) {
      setError((err as any).message);
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
