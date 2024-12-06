import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import Spinner from "../components/spinner";
import { getPersonDetails } from "../api/tmdb-api";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Box,
} from "@mui/material";
import { format } from "date-fns";

const PersonDetailPage = () => {
  const { id } = useParams();
  const { data, error, isLoading, isError } = useQuery(
    ["person-detail", { id }],
    () => getPersonDetails(id)
  );

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h4" color="error">
          {(error as any).message}
        </Typography>
      </Box>
    );
  }

  const {
    name,
    biography,
    birthday,
    deathday,
    place_of_birth,
    known_for_department,
    profile_path,
  } = data;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h3" gutterBottom>
        {name}
      </Typography>

      <Grid container spacing={4}>
        {/* Profile Picture */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardMedia
              component="img"
              image={
                profile_path
                  ? `https://image.tmdb.org/t/p/w500${profile_path}`
                  : "https://via.placeholder.com/500x750?text=No+Image"
              }
              alt={name}
            />
          </Card>
        </Grid>

        {/* Person Details */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                About {name}
              </Typography>

              <Typography variant="body1" gutterBottom>
                <strong>Known For:</strong> {known_for_department || "N/A"}
              </Typography>

              <Typography variant="body1" gutterBottom>
                <strong>Born:</strong> {birthday ? format(new Date(birthday), "MMMM dd, yyyy") : "N/A"}
              </Typography>

              {deathday && (
                <Typography variant="body1" gutterBottom>
                  <strong>Died:</strong> {format(new Date(deathday), "MMMM dd, yyyy")}
                </Typography>
              )}

              <Typography variant="body1" gutterBottom>
                <strong>Place of Birth:</strong> {place_of_birth || "N/A"}
              </Typography>

              <Typography variant="body1" gutterBottom>
                <strong>Biography:</strong>
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {biography || "No biography available."}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PersonDetailPage;
