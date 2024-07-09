import React, { useEffect, useState } from "react";
import "./movieList.css";
import { useParams } from "react-router-dom";
import Cards from "../card/card";

const MovieList = () => {
  const [movieList, setMovieList] = useState([]);
  const { type } = useParams();

  useEffect(() => {
    getData();
  }, [type]);

  const getData = () => {
    fetch(
      `https://api.themoviedb.org/3/movie/${type ? type : "popular"}?api_key=f2419be680eb57c59af5546ebdb0df53&language=en-US`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.results) {
          setMovieList(data.results);
        } else {
          console.error("No results found in API response:", data);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  return (
    <div className="movie__list">
      <h2 className="list__title">{(type ? type : "POPULAR").toUpperCase()}</h2>
      <div className="list__cards">
        {movieList && movieList.length > 0 ? (
          movieList.map((movie) => <Cards key={movie.id} movie={movie} />)
        ) : (
          <p>No movies found</p>
        )}
      </div>
    </div>
  );
};

export default MovieList;
