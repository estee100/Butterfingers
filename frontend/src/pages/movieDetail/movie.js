import React, { useEffect, useState, useCallback } from 'react';
import './movie.css';
import { useParams, Link } from 'react-router-dom';
import Cards from '../../components/card/card';
import axios from 'axios';
import Toast from '../../components/popUp/toast';

const Movie = () => {
  const [currentMovieDetail, setMovie] = useState();
  const [similarMovies, setSimilarMovies] = useState([]);
  const [directors, setDirectors] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState('');
  const [inMyList, setInMyList] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const { id } = useParams();

  const getData = useCallback(async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=f2419be680eb57c59af5546ebdb0df53&language=en-US`
      );
      const data = await response.json();
      setMovie(data);
    } catch (error) {
      console.error("Error fetching movie data:", error);
    }
  }, [id]);

  const fetchSimilarMovies = useCallback(async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/similar?api_key=f2419be680eb57c59af5546ebdb0df53&language=en-US&page=1`
      );
      const data = await response.json();
      setSimilarMovies(data.results.slice(0, 7));
    } catch (error) {
      console.error("Error fetching similar movies:", error);
    }
  }, [id]);

  const fetchCredits = useCallback(async () => {
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
  }, [id]);

  const fetchTrailer = useCallback(async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/videos?api_key=f2419be680eb57c59af5546ebdb0df53&language=en-US`
      );
      const data = await response.json();
      const trailers = data.results.filter(video => video.type === 'Trailer' && video.site === 'YouTube');
      if (trailers.length > 0) {
        setTrailerUrl(`https://www.youtube.com/watch?v=${trailers[0].key}`);
      }
    } catch (error) {
      console.error("Error fetching trailer:", error);
    }
  }, [id]);

  useEffect(() => {
    getData();
    fetchSimilarMovies();
    fetchCredits();
    fetchTrailer();
    window.scrollTo(0, 0);
  }, [id, getData, fetchSimilarMovies, fetchCredits, fetchTrailer]);

  const addToMyList = async () => {
    const token = localStorage.getItem('accessToken');
  
    if (!token) {
      setToastMessage("Access token is missing. Please login to add movies to your list.");
      return;
    }
  
    if (!currentMovieDetail || !currentMovieDetail.id) {
      setToastMessage("Movie details are not available.");
      return;
    }
  
    try {
      const response = await axios.post(
        'http://localhost:4321/add-to-list',
        { movieId: currentMovieDetail.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.data.error) {
        setToastMessage(`Server Error: ${response.data.message}`);
      } else {
        setInMyList(true);
        setToastMessage("Movie added to My List!");
      }
    } catch (error) {
      console.error("Error adding movie to list:", error.response ? error.response.data : error.message);
      setToastMessage("An error occurred while adding the movie to your list.");
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
        <div className="useful_links"></div>
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
        {trailerUrl && (
          <a
            href={trailerUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            <p>
              <span className="movie__trailerButton movie__Button">
                Trailer<i className="newTab fas fa-external-link-alt"></i>
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
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage('')} />
      )}
    </div>
  );
};

export default Movie;