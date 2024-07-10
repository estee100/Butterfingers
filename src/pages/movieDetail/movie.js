import React, { useEffect, useState } from "react";
import "./movie.css";
import { useParams, Link } from "react-router-dom";
import Cards from "../../components/card/card"; // Adjust path as per your file structure

const Movie = () => {
  const [currentMovieDetail, setMovie] = useState();
  const [similarMovies, setSimilarMovies] = useState([]);
  const [directors, setDirectors] = useState([]);
  const { id } = useParams();

  // Function to handle adding movie to list
  const addToMyList = () => {
    // Example: Save movie to local storage
    const myList = JSON.parse(localStorage.getItem("myList")) || [];
    myList.push(currentMovieDetail); // Adjust as needed, you might want to store IDs or specific details
    localStorage.setItem("myList", JSON.stringify(myList));
    alert("Movie added to My List!");
  };

  useEffect(() => {
    getData();
    fetchSimilarMovies();
    fetchCredits();
    window.scrollTo(0, 0);
  }, [id]); // Add id as a dependency to refetch data when id changes

  const getData = () => {
    fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=f2419be680eb57c59af5546ebdb0df53&language=en-US`
    )
      .then((res) => res.json())
      .then((data) => setMovie(data));
  };

  const fetchSimilarMovies = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/similar?api_key=f2419be680eb57c59af5546ebdb0df53&language=en-US&page=1`
      );
      const data = await response.json();
      setSimilarMovies(data.results.slice(0, 7)); // Limit to top 7 similar movies
    } catch (error) {
      console.error("Error fetching similar movies:", error);
    }
  };

  const fetchCredits = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/credits?api_key=f2419be680eb57c59af5546ebdb0df53`
      );
      const data = await response.json();
      const directors = data.crew.filter((member) => member.job === "Director");
      setDirectors(directors);
    } catch (error) {
      console.error("Error fetching credits:", error);
    }
  };

  return (
    <div className="movie">
      <div className="movie__intro">
        <img
          className="movie__backdrop"
          src={`https://image.tmdb.org/t/p/original${
            currentMovieDetail ? currentMovieDetail.backdrop_path : ""
          }`}
          alt={currentMovieDetail ? currentMovieDetail.original_title : ""}
        />
      </div>
      <div className="movie__detail">
        <div className="movie__detailLeft">
          <div className="movie__posterBox">
            <img
              className="movie__poster"
              src={`https://image.tmdb.org/t/p/original${
                currentMovieDetail ? currentMovieDetail.poster_path : ""
              }`}
              alt={currentMovieDetail ? currentMovieDetail.original_title : ""}
            />
          </div>
        </div>
        <div className="movie__detailRight">
          <div className="movie__detailRightTop">
            <div className="movie__name">
              {currentMovieDetail ? currentMovieDetail.original_title : ""}
            </div>
            <div className="movie__tagline">
              {currentMovieDetail ? currentMovieDetail.tagline : ""}
            </div>
            <div className="movie__rating">
              {currentMovieDetail ? currentMovieDetail.vote_average : ""}{" "}
              <i className="fas fa-star" />
              <span className="movie__voteCount">
                {currentMovieDetail
                  ? "(" + currentMovieDetail.vote_count + ") votes"
                  : ""}
              </span>
            </div>
            <div className="movie__runtime">
              {currentMovieDetail ? currentMovieDetail.runtime + " mins" : ""}
            </div>
            <div className="movie__releaseDate">
              {currentMovieDetail
                ? "Release date: " + currentMovieDetail.release_date
                : ""}
            </div>
            <div className="movie__genres">
              {currentMovieDetail &&
                currentMovieDetail.genres &&
                currentMovieDetail.genres.map((genre) => (
                  <span key={genre.id} className="movie__genre">
                    {genre.name}
                  </span>
                ))}
            </div>
          </div>
          <div className="movie__production">
            <div className="movie__heading">Directors</div>
            <div className="movie__directors">
              {directors.map((director) => (
                <div key={director.id} className="movie__director">
                  {director.name}
                </div>
              ))}
            </div>
            <hr />
          </div>
          <div className="movie__detailRightBottom">
            <div className="synopsisText">Synopsis</div>
            <div>{currentMovieDetail ? currentMovieDetail.overview : ""}</div>
            <hr />
          </div>
          <button className="addToListButton" onClick={addToMyList}>
            Add to My List
          </button>
        </div>
      </div>
      <div className="movie__links">
        <div className="useful_links">Useful Links:</div>
        {currentMovieDetail && currentMovieDetail.homepage && (
          <a
            href={currentMovieDetail.homepage}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            <p>
              <span className="movie__homeButton movie__Button">
                Homepage <i className="newTab fas fa-external-link-alt"></i>
              </span>
            </p>
          </a>
        )}
        {currentMovieDetail && currentMovieDetail.imdb_id && (
          <a
            href={"https://www.imdb.com/title/" + currentMovieDetail.imdb_id}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            <p>
              <span className="movie__imdbButton movie__Button">
                IMDb<i className="newTab fas fa-external-link-alt"></i>
              </span>
            </p>
          </a>
        )}
      </div>
      <div className="movie__similar">
        <div className="movie__heading">Similar Movies</div>
        <div className="movie__similarList">
          {similarMovies.map((movie) => (
            <Link key={movie.id} to={`/movie/${movie.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Cards movie={movie} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Movie;
