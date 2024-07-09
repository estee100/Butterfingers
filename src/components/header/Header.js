import React from "react";
import "./Header.css";
import { Link } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import SearchBar from "../searchBar/searchBar";
const Header = () => {
  return (
    <div className="header">
      <div className="headerLeft">
        <Link to="/">
          <img className="header__icon" src="/newnewlogo.png" alt="Logo" />
        </Link>
        <Link to="/movies/popular" className="headerLink">
          <span>Popular</span>
        </Link>
        <Link to="/movies/top_rated" className="headerLink">
          <span>Top Rated</span>
        </Link>
        <Link to="/movies/upcoming" className="headerLink">
          <span>Upcoming</span>
        </Link>
        <Link to="/movies/my_list" className="headerLink">
          <span>My List</span>
        </Link>
      </div>
      <div className="headerRight">
        <div className="search_icon">
          <form>
            <input
              type="text"
              placeholder="Search here..."
              className="searchInput"
            />
            <button className="searchIcon">
            <IoSearchOutline/>
            </button>
          </form>
        </div>

        <div className="profile_icon">
          <Link to="/search">
            <CgProfile className="profileIcon" style={{ color: "white" }} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
