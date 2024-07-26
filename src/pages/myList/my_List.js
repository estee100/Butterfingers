import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './my_List.css';

const MyListPage = () => {
    const [movies, setMovies] = useState([]);
    const isLoggedIn = !!localStorage.getItem('accessToken');
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) {
            setMovies([]);
            return;
        }

        const fetchMovies = async () => {
            try {
                const response = await axios.get('http://localhost:4321/my-list', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
                });
                setMovies(response.data);
            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        };

        fetchMovies();
    }, [isLoggedIn]);

    const updateMovie = async (movieId, rating, status) => {
        try {
            await axios.put(`http://localhost:4321/my-list/${movieId}`, 
                { rating, status },
                { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }
            );
        } catch (error) {
            console.error('Error updating movie:', error);
        }
    };

    const handleRemoveMovie = async (movieId) => {
        try {
            const response = await axios.delete(`http://localhost:4321/my-list/${movieId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });

            if (response.status === 200) {
                setMovies(prevMovies => prevMovies.filter(movie => movie.movieId !== movieId));
            } else {
                console.error('Failed to remove movie:', response.statusText);
            }
        } catch (error) {
            console.error('Error removing movie:', error);
        }
    };

    const handleRatingChange = async (movieId, newRating) => {
        setMovies(prevMovies => 
            prevMovies.map(movie =>
                movie.movieId === movieId ? { ...movie, rating: newRating } : movie
            )
        );
        await updateMovie(movieId, newRating, undefined); // Call backend to update rating
    };

    const handleStatusChange = async (movieId, newStatus) => {
        setMovies(prevMovies => 
            prevMovies.map(movie =>
                movie.movieId === movieId ? { ...movie, status: newStatus } : movie
            )
        );
        await updateMovie(movieId, undefined, newStatus); // Call backend to update status
    };

    const sortedMovies = movies.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    return (
        <div className="my-list-page">
            <h1 className='movie-list-header'>My Movie List</h1>
            {sortedMovies.length === 0 ? (
                <p>Your list is empty.</p>
            ) : (
                <div className="movie-list">
                    {sortedMovies.map(movie => (
                        <div key={movie.movieId} className="movie-item">
                            <MoviePoster src={movie.posterPath} alt={movie.title} />
                            <div className="movie-info">
                                <h2 
                                    className="movie-title" 
                                    onClick={() => navigate(`/movie/${movie.movieId}`)}
                                >
                                    {movie.title}
                                </h2>
                                <div className="movie-details">
                                    <div className="rating">
                                        <label>Rating: </label>
                                        <RatingDropdown 
                                            currentRating={movie.rating || 0}
                                            onRatingChange={(newRating) => handleRatingChange(movie.movieId, newRating)}
                                        />
                                    </div>
                                    <div className="status">
                                        <label>Status: </label>
                                        <StatusDropdown 
                                            currentStatus={movie.status || 'Planning to Watch'}
                                            onStatusChange={(newStatus) => handleStatusChange(movie.movieId, newStatus)}
                                        />
                                    </div>
                                    <p className="movie-overview">{movie.overview}</p>
                                    <button className="remove-button" onClick={() => handleRemoveMovie(movie.movieId)}>
                                        Remove from List
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const MoviePoster = ({ src, alt }) => {
    const placeholderUrl = 'https://via.placeholder.com/150x225'; 
    const [imageSrc, setImageSrc] = useState(src ? `https://image.tmdb.org/t/p/original${src}` : placeholderUrl);

    useEffect(() => {
        setImageSrc(src ? `https://image.tmdb.org/t/p/original${src}` : placeholderUrl);
    }, [src]);

    const handleError = () => {
        setImageSrc(placeholderUrl); 
    };

    return (
        <img 
            src={imageSrc} 
            alt={alt} 
            onError={handleError}
            style={{ width: '150px', height: '225px' }} 
        />
    );
};

const RatingDropdown = ({ currentRating, onRatingChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedRating, setSelectedRating] = useState(currentRating);

    const handleClick = (rating) => {
        setSelectedRating(rating);
        onRatingChange(rating);
        setIsOpen(false);
    };

    return (
        <div className="rating-dropdown">
            <button onClick={() => setIsOpen(!isOpen)} className="rating-button">
                {selectedRating || 'Rate'}
            </button>
            {isOpen && (
                <ul className="rating-menu">
                    {[...Array(10)].map((_, index) => (
                        <li key={index + 1} onClick={() => handleClick(index + 1)}>
                            {index + 1}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const StatusDropdown = ({ currentStatus, onStatusChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(currentStatus);

    const handleClick = (status) => {
        setSelectedStatus(status);
        onStatusChange(status);
        setIsOpen(false);
    };

    return (
        <div className="status-dropdown">
            <button onClick={() => setIsOpen(!isOpen)} className="status-button">
                {selectedStatus || 'Select Status'}
            </button>
            {isOpen && (
                <ul className="status-menu">
                    {['Plan to Watch', 'Watched'].map((status) => (
                        <li key={status} onClick={() => handleClick(status)}>
                            {status}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MyListPage;