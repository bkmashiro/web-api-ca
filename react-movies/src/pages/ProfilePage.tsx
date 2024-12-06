import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/userContext";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
} from "@mui/material";

const ProfilePage: React.FC = () => {
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 3000);

      return () => clearTimeout(timer); // 清理定时器，避免内存泄漏
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
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
          You are not logged in. Redirecting to login page in 3 seconds...
        </Typography>
      </Box>
    );
  }
  console.log(currentUser);
  const {
    email,
    emailVerified,
    metadata: { creationTime, lastSignInTime },
    providerData,
  } = currentUser.user;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>
      <Card sx={{ maxWidth: 600, mx: "auto", mt: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Email:
              </Typography>
              <Typography>{email || "N/A"}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Email Verified:
              </Typography>
              <Typography>{emailVerified ? "Yes" : "No"}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Created At:
              </Typography>
              <Typography>
                {creationTime ? new Date(creationTime).toLocaleString() : "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Last Sign-In:
              </Typography>
              <Typography>
                {lastSignInTime
                  ? new Date(lastSignInTime).toLocaleString()
                  : "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Autherization Providers:
              </Typography>
              {providerData.map((provider, index) => (
                <Typography key={index}>
                  {provider.providerId} ({provider.email || "N/A"})
                </Typography>
              ))}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProfilePage;
