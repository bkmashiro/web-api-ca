import React, { useState } from "react";
import Header from "../headerMovieList";
import FilterCard from "../filterMoviesCard";
import MovieList from "../movieList";
import Grid from "@mui/material/Grid2";

type Filter = (movie: any) => boolean;

function MovieListPageTemplate({ movies, title, action }) {
  const [filters, setFilters] = useState<{
    [key: string]: Filter;
  }>({});

  const [sortBy, setSortBy] = useState<{
    [key: string]: (a: any, b: any) => number;
  }>({}); // State to store the sorting function

  const handleFiltersChange = (name, filter) => {
    setFilters((prev) => ({ ...prev, [name]: filter }));
  };

  const handleRemoveFilter = (name) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[name];
      return newFilters;
    });
  };

  const handleSorterChange = (name, sorter) => {
    setSortBy((prev) => ({ ...prev, [name]: sorter }));
  };

  const displayedMovies = movies.filter((m) => {
    // console.log(filters);
    const filterKeys = Object.keys(filters);
    return filterKeys.every((key) => {
      if (!filters[key]) {
        return true;
      }
      return filters[key](m);
    });
  });

  // multiple sorters
  const sortedMovies = displayedMovies.sort((a, b) => {
    const sortKeys = Object.keys(sortBy);
    for (let i = 0; i < sortKeys.length; i++) {
      // if is null, then we skip
      if (!sortBy[sortKeys[i]]) {
        continue;
      }

      const result = sortBy[sortKeys[i]](a, b);
      // Not exaclty correct, if it has multiple sorters, it's not a partial order,
      // there is no way we can compare
      // so we just assume the priority is from left to right
      if (result !== 0) {
        return result;
      }
    }
    return 0;
  });

  return (
    <Grid container>
      <Grid size={12}>
        <Header title={title} />
      </Grid>
      <Grid container sx={{ flex: "1 1 500px" }}>
        <Grid
          key="find"
          size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}
          sx={{ padding: "20px" }}
        >
          <FilterCard
            onFilterChange={handleFiltersChange}
            onFilterRemoved={handleRemoveFilter}
            onSorterChange={handleSorterChange}
          />
        </Grid>
        <MovieList action={action} movies={sortedMovies}></MovieList>
      </Grid>
    </Grid>
  );
}
export default MovieListPageTemplate;
