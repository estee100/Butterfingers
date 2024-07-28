import React from 'react';
import { Link } from 'react-router-dom';
import '../header/Header.css';

const ProfileInfo = ({ openProfile, setOpenProfile, userInfo }) => {
  return (
    openProfile && (
      <div className={`profile-menu ${openProfile ? 'visible' : 'hidden'}`}>
        {userInfo ? (
          <>
            <div className="profile-details">
              <div className="profile-name">{userInfo.name}</div>
              <button className="logout-button" onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}>
                Logout
              </button>
            </div>
          </>
        ) : (
          <div className="login-button">
            <Link to="/login">Login</Link>
          </div>
        )}
      </div>
    )
  );
};

export default ProfileInfo;
