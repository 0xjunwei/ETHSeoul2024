import React from 'react';
import VerifiedIcon from '@mui/icons-material/Verified';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import GavelIcon from '@mui/icons-material/Gavel';

function SwipeCard({ name, photo }) {
  return (
    <div className="swipe-outer-container">
      <div className="swipe-container">
        <img src={photo} className="swipe-img" alt="Your Image" />
        <div className="flex items-center">
          <h1 className="username2">{name}</h1>
          <div>
            <VerifiedIcon fontSize="medium" className="badge-dark" sx={{ mr: 1 }} /><span className="swipe-text">Identity verified</span>
          </div>
          <div>
            <Diversity3Icon fontSize="medium" className="badge-dark" sx={{ mr: 1 }} /><span className="swipe-text">Marriage status: single</span>
          </div>
          <div>
            <GavelIcon fontSize="medium" className="badge-dark" sx={{ mr: 1 }} /><span className="swipe-text">0 criminal records</span>
          </div>
          <p className="swipe-text2">
            Hobbies: solo traveling, photography, coding.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SwipeCard;
