import React from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

const CustomAppBar = ({ connected, onConnectClick, onSwipeClick, onVerificationsClick }) => {
  return (
    <AppBar position="static">
      <Toolbar className="top-navigation">
        <Button onClick={onSwipeClick}>
          <FavoriteBorderIcon fontSize="medium" color="primary" sx={{ mr: 0.5 }} />
          Swipe
        </Button>
        <Button onClick={onVerificationsClick}>
          <VerifiedUserIcon fontSize="medium" color="primary" sx={{ mr: 0.5 }} />
          My Verifications
        </Button>
        <Typography variant="h6" component="div" color="primary" sx={{ flexGrow: 1, mr: 18 }}>
          STinDer
        </Typography>
        <Button color="primary" onClick={onConnectClick}>
          {connected ? "Connected" : "Connect Wallet"}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;
