import React, { useContext, useEffect } from "react";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import { getReview, deleteReviews } from "../../api/local-api";
import { MoviesContext } from "../../contexts/moviesContext";
import { UserContext } from "../../contexts/userContext";

const MovieReview = ({ review }) => {
  const { deleteReview } = useContext(MoviesContext);
  const { setCurrentUser } = useContext(UserContext);
  return (
    <>
      <Typography variant="h5" component="h3">
        Review By: {review.author}
      </Typography>

      <Typography variant="h6" component="p">
        {review.content}
      </Typography>

      <Typography variant="h6" component="p">
        Rating: {review.rating}
      </Typography>

      <Typography variant="h6" component="p">
        Date: {review.date}
      </Typography>

      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          deleteReview(review._id);

          setCurrentUser((prev) => {
            return {
              ...prev,
              reviews: prev.reviews.filter((r) => r !== review._id),
            };
          });
        }}
      >
        Delete
      </Button>
    </>
  );
};

export const IDReview = ({ reviewID }) => {
  const [review, setReview] = React.useState(null);

  useEffect(() => {
    getReview(reviewID).then((review) => {
      setReview(review);
    });
  }, [reviewID]);

  return review ? <MovieReview review={review} /> : <p>Loading...</p>;
};

export default MovieReview;
