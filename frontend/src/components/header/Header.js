import React, { useEffect, useState } from "react";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import ProfileInfo from './profileInfo';
import axiosInstance from "../../utils/axiosInstance";

const Header = () => {
  const [searchInput, setSearchInput] = useState('');
  const [prevSearch, setPrevSearch] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const [openProfile, setOpenProfile] = useState(false);

  useEffect(() => {
    if (searchInput && searchInput !== prevSearch) {
      navigate(`/search?q=${searchInput}`);
      setPrevSearch(searchInput);
    }
  }, [searchInput, navigate, prevSearch]);

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    getUserInfo();
  }, [navigate]);

  return (
    <div className={`header ${openProfile ? 'shifted' : ''}`}>
      <div className={`headerLeft ${openProfile ? 'shifted-left' : ''}`}>
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
      <div className={`headerRight ${openProfile ? 'shifted-left' : ''}`}>
        <div className="search_icon">
          <form onSubmit={(e) => {
            e.preventDefault();
            if (searchInput) {
              navigate(`/search?q=${searchInput}`);
            }
          }}>
            <input
              type="text"
              placeholder="Search for movies..."
              className="searchInput"
              onChange={(e) => setSearchInput(e.target.value)}
              value={searchInput}
            />
            <button className="searchIcon">
              <IoSearchOutline />
            </button>
          </form>
        </div>

        <div className="profile_icon">
          <CgProfile
            className="profileIcon"
            style={{ color: "white" }}
            onClick={() => setOpenProfile((prev) => !prev)}
          />
        </div>
        <ProfileInfo openProfile={openProfile} setOpenProfile={setOpenProfile} userInfo={userInfo} />
      </div>
    </div>
  );
};

export default Header;
