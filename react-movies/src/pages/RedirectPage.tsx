// src/pages/RedirectPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CircularProgress, Box, Typography } from "@mui/material";

interface RedirectPageProps {
  defaultDestination?: string;
  delayTime?: number;
}

const RedirectPage: React.FC<RedirectPageProps> = ({
  defaultDestination = "/",
  delayTime = 3000,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const getQueryParams = (search: string) => {
    const params = new URLSearchParams(search);
    return {
      destination: params.get("destination"),
      reason: params.get("reason"),
    };
  };

  useEffect(() => {
    const redirect = async () => {
      setIsRedirecting(true);

      try {
        const queryParams = getQueryParams(location.search);
        const state = location.state as
          | { destination?: string; reason?: string }
          | undefined;

        const destination =
          queryParams.destination || state?.destination || defaultDestination;

        setTimeout(() => {
          navigate(destination);
        }, delayTime);
      } catch (error) {
        console.error("Error during redirect:", error);
        setTimeout(() => navigate(defaultDestination), delayTime);
      }
    };

    redirect();
  }, [navigate, location, defaultDestination, delayTime]);

  const queryParams = getQueryParams(location.search);
  const reason =
    queryParams.reason || (location.state as { reason?: string })?.reason;

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
        {reason || "Redirecting..."}
      </Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        Please wait {delayTime / 1000} seconds...
      </Typography>
    </Box>
  );
};

export default RedirectPage;
