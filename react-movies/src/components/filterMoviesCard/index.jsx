import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import img from "../../images/pexels-dziana-hasanbekava-5480827.jpg";
import { getGenres } from "../../api/tmdb-api";
import { useQuery } from "react-query";
import Spinner from "../spinner";

const formControl = {
  margin: 1,
  minWidth: "90%",
  backgroundColor: "rgb(255, 255, 255)",
};

export default function FilterMoviesCard(props) {
  const { data, error, isLoading, isError } = useQuery("genres", getGenres);
  const { onFilterChange, onFilterRemoved, onSorterChange } = props;

  const [ratingSortOrder, setRatingSortOrder] = useState(0); // 0: no sort, 1: ascending, -1: descending
  const [dateSortOrder, setDateSortOrder] = useState(0);

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }

  const genres = data.genres;
  if (genres[0].name !== "All") {
    genres.unshift({ id: "0", name: "All" });
  }

  const handleFilterChange = (e, name, filter) => {
    e.preventDefault();
    onFilterChange(name, filter);
  };

  const toggleSortOrder = (name, currentOrder, setOrder, sorter) => {
    // 0 -> 1 -> -1 -> 0
    const nextOrder = currentOrder === 0 ? 1 : currentOrder === 1 ? -1 : 0;

    setOrder(nextOrder);

    if (nextOrder === 1) {
      onSorterChange(name,sorter); // Ascending
    } else if (nextOrder === -1) {
      onSorterChange(name,(a, b) => -sorter(a, b)); // Descending
    } else {
      onSorterChange(name, null); // No sorting
    }
  };

  return (
    <Card
      sx={{
        backgroundColor: "rgb(204, 204, 0)",
      }}
      variant="outlined"
    >
      <CardContent>
        <Typography variant="h5" component="h1">
          <SearchIcon fontSize="large" />
          Filter the movies.
        </Typography>
        <div>
          <TextField
            sx={{ ...formControl }}
            id="filled-search"
            label="Search field"
            type="search"
            variant="filled"
            value={props.titleFilter}
            onChange={(e) =>
              handleFilterChange(e, "search-text", (movie) =>
                movie.title.toLowerCase().includes(e.target.value.toLowerCase())
              )
            }
          />

          <button
            onClick={() => {
              onFilterRemoved("search-text");
              document.getElementById("filled-search").value = "";
            }}
          >
            Clear Search
          </button>
        </div>

        <FormControl sx={{ ...formControl }}>
          <InputLabel id="genre-label">Genre</InputLabel>
          <Select
            labelId="genre-label"
            id="genre-select"
            defaultValue=""
            value={props.genreFilter}
            onChange={(e) =>
              handleFilterChange(e, "genre", (movie) => {
                if (e.target.value === "0") {
                  return true;
                } else {
                  return movie.genre_ids.includes(Number(e.target.value));
                }
              })
            }
          >
            {genres.map((genre) => (
              <MenuItem key={genre.id} value={genre.id}>
                {genre.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Rating Filter */}
        <FormControl sx={{ ...formControl }}>
          <Typography>Rating (Min):</Typography>
          <Slider
            defaultValue={0}
            step={1}
            marks
            min={0}
            max={10}
            valueLabelDisplay="auto"
            onChange={(e, value) =>
              handleFilterChange(
                e,
                "rating",
                (movie) => movie.vote_average >= value
              )
            }
          />
        </FormControl>

        {/* Date Filter */}
        <FormControl sx={{ ...formControl }}>
          <Typography>Release Date After:</Typography>
          <TextField
            id="date-after"
            type="date"
            onChange={(e) =>
              handleFilterChange(
                e,
                "date-after",
                (movie) =>
                  new Date(movie.release_date) >= new Date(e.target.value)
              )
            }
          />
        </FormControl>

        {/* Sort by Rating */}
        <Button
          variant="contained"
          color="primary"
          onClick={() =>
            toggleSortOrder(
              "rating",
              ratingSortOrder,
              setRatingSortOrder,
              (a, b) => a.vote_average - b.vote_average
            )
          }
        >
          Sort by Rating (
          {ratingSortOrder === 1
            ? "Asc"
            : ratingSortOrder === -1
            ? "Desc"
            : "None"}
          )
        </Button>

        {/* Sort by Release Date */}
        <Button
          variant="contained"
          color="secondary"
          onClick={() =>
            toggleSortOrder(
              "date",
              dateSortOrder,
              setDateSortOrder,
              (a, b) => new Date(a.release_date) - new Date(b.release_date)
            )
          }
        >
          Sort by Date (
          {dateSortOrder === 1 ? "Asc" : dateSortOrder === -1 ? "Desc" : "None"}
          )
        </Button>
      </CardContent>
      <CardMedia sx={{ height: 300 }} image={img} title="Filter" />
      <CardContent>
        <Typography variant="h5" component="h1">
          <SearchIcon fontSize="large" />
          Filter the movies.
          <br />
        </Typography>
      </CardContent>
    </Card>
  );
}
