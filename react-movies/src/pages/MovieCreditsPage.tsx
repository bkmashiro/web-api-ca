import React from "react";
import { useParams } from "react-router-dom";
import { getMovieCredits, getMovieReviews } from "../api/tmdb-api";
import { useQuery } from "react-query";
import Spinner from "../components/spinner";

type MovieCredits = {
  cast: {
    adult: boolean;
    gender: number;
    id: number;
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number;
    profile_path: string;
    cast_id: number;
    character: string;
    credit_id: string;
    order: number;
  }[];
  crew: {
    adult: boolean;
    gender: number;
    id: number;
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number;
    profile_path: string;
    credit_id: string;
    department: string;
    job: string;
  }[];
};

const MovieCreditsPage = () => {
  const id = useParams().id;

  const {
    data: movie,
    error,
    isLoading,
    isError,
  } = useQuery<any, any, MovieCredits, any>(
    ["movie-credits", { id }],
    ({ queryKey: [_, { id }] }) => getMovieCredits(id)
  );

  console.log(movie);
  // remove duplicate crew members, sometimes the same person is listed multiple times
  if (movie) {
    movie.crew = movie.crew.filter(
      (crew, index, self) => index === self.findIndex((t) => t.id === crew.id)
    );

    movie.cast = movie.cast.filter(
      (cast, index, self) => index === self.findIndex((t) => t.id === cast.id)
    );
  }

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{(error as any).message}</h1>;
  }

  return (
    <>
      {movie ? (
        <>
          <h1>Credits</h1>

          <h2>Cast</h2>

          <table>
            <thead>
              <tr>
                <th>Actor</th>
                <th>Character</th>
              </tr>
            </thead>
            <tbody>
              {movie.cast.map((cast) => (
                <tr key={cast.id}>
                  <td>{cast.name}</td>
                  <td>{cast.character}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>Crew</h2>

          <table>
            <thead>
              <tr>
                <th>Member</th>
                <th>Job</th>
              </tr>
            </thead>
            <tbody>
              {movie.crew.map((crew) => (
                <tr key={crew.id}>
                  <td>{crew.name}</td>
                  <td>{crew.job}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p>Waiting for movie details</p>
      )}
    </>
  );
};

export default MovieCreditsPage;
