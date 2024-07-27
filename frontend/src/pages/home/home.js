import React, { useEffect, useState } from "react";
import "./home.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { Link } from "react-router-dom";
import MovieList from "../../components/movieList/movieList";
import axiosInstance from "../../utils/axiosInstance";

const API_KEY = process.env.REACT_APP_API_KEY;

const Home = () => {
    const [popularMovies, setPopularMovies] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPopularMovies = async () => {
            try {
                const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US`);
                const data = await response.json();
                setPopularMovies(data.results);
            } catch (error) {
                console.error("Error fetching popular movies:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPopularMovies();
    }, []);

    const getUserInfo = async () => {
        try {
            const response = await axiosInstance.get("get-user");
            if (response.data && response.data.user) {
                setUserInfo(response.data.user);
            }
        } catch (error) {
            console.error("Error fetching user info:", error);
        }
    };

    useEffect(() => {
        getUserInfo();
    }, []);

    return (
        <>
            <div className="poster">
                {!loading ? (
                    <Carousel
                        showThumbs={false}
                        autoPlay={true}
                        interval={5000}
                        transitionTime={500}
                        infiniteLoop={true}
                        showStatus={false}
                        swipeable={true}
                        emulateTouch={true}
                        selectedItem={0}
                    >
                        {
                            popularMovies.map(movie => (
                                <Link key={movie.id} style={{ textDecoration: "none", color: "white" }} to={`/movie/${movie.id}`}>
                                    <div className="posterImage">
                                        <img src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`} alt={movie.original_title} />
                                    </div>
                                    <div className="posterImage__overlay">
                                        <div className="posterImage__title">{movie.original_title}</div>
                                        <div className="posterImage__runtime">
                                            {movie.release_date}
                                            <span className="posterImage__rating">
                                                {movie.vote_average}
                                                <i className="fas fa-star" />{" "}
                                            </span>
                                        </div>
                                        <div className="posterImage__description">{movie.overview}</div>
                                    </div>
                                </Link>
                            ))
                        }
                    </Carousel>
                ) : (
                    <div>Loading...</div>
                )}
                <MovieList />
            </div>
        </>
    );
};

export default Home;