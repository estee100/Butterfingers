import React, { useEffect, useState } from "react";
import "./movieList.css";
import { useParams } from "react-router-dom";
import Cards from "../card/card";

const API_KEY = process.env.REACT_APP_API_KEY;

const MovieList = () => {
  const [movieList, setMovieList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { type } = useParams();

  useEffect(() => {
    getData(page);
  }, [type, page]);

  const getData = (pageNumber) => {
    fetch(
      ` https://api.themoviedb.org/3/movie/${type ? type : "popular"}?api_key=${API_KEY}&language=en-US&page=${pageNumber}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.results) {
          setMovieList(prevMovies => pageNumber === 1 ? data.results : [...prevMovies, ...data.results]);
          setTotalPages(data.total_pages);
        } else {
          console.error("No results found in API response:", data);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(prevPage => prevPage - 1);
    }
  };

  return (
    <div className="movie__list">
      <h2 className="list__title">
        {(type ? type.replace(/_/g, " ") : "POPULAR").toUpperCase()}
      </h2>
      <div className="list__cards">
        {movieList && movieList.length > 0 ? (
          movieList.map((movie) => <Cards key={movie.id} movie={movie} />)
        ) : (
          <p>No movies found</p>
        )}
      </div>
      <div className="pagination-controls">
        <button onClick={handlePrevPage} disabled={page === 1}>
          Show less
        </button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={page === totalPages}>
          Show more
        </button>
      </div>
    </div>
  );
};

export default MovieList;
