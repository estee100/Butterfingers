import React, { useEffect, useState } from "react";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";


const Header = () => {

  const [searchInput, setSearchInput] = useState('')
  const navigate = useNavigate()
  
  useEffect(()=>{
    if(searchInput){
      navigate(`/search?q=${searchInput}`)
    }
  },[searchInput])



  const handleSubmit = (e)=>{
    e.preventDefault()
  }

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
        <Link to="/movies/mylist" className="headerLink">
          <span>My List</span>
        </Link>
      </div>
      <div className="headerRight">
        <div className="searchicon">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Search for movies..."
              className="searchInput"
              onChange={(e)=>setSearchInput(e.target.value)}
              value={(searchInput)}
            />
            <button className="searchIcon">
            <IoSearchOutline/>
            </button>
          </form>
        </div>

        <div className="profile_icon">
          <Link to="/auth">
            <CgProfile className="profileIcon" style={{ color: "white" }} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
