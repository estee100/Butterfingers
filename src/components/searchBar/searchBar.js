import React, { useState, useEffect } from "react";
import "./searchBar.css"; // Create a new CSS file for SearchBar styling
import { IoSearchOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  const handleSearchClick = () => {
    setSearchVisible(!searchVisible);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    if (searchTerm) {
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  const fetchSuggestions = async () => {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=f2419be680eb57c59af5546ebdb0df53&query=${searchTerm}`
    );
    const data = await response.json();
    setSuggestions(data.results);
  };

  const handleSuggestionClick = (movieId) => {
    navigate(`/movie/${movieId}`);
    setSearchVisible(false);
    setSearchTerm("");
  };

  return (
    <div className="searchBar">
      <div className="search_icon" onClick={handleSearchClick}>
        <IoSearchOutline style={{ color: "white", fontSize: "24px" }} />
      </div>
      {searchVisible && (
        <div className="searchBox">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search movies..."
          />
          <div className="suggestions">
            {suggestions.map((movie) => (
              <div
                key={movie.id}
                className="suggestion"
                onClick={() => handleSuggestionClick(movie.id)}
              >
                {movie.title}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
