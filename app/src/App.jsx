import React, { useState } from 'react';
import './App.css'
import './styles.css';
import logo from '../public/logo.png'
import profilePhoto from './assets/profilePhoto.png'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Divider from '@mui/material/Divider';
import Switch from '@mui/material/Switch';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import VerifiedIcon from '@mui/icons-material/Verified';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import GavelIcon from '@mui/icons-material/Gavel';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import PregnantWomanIcon from '@mui/icons-material/PregnantWoman';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const theme = createTheme({
  palette: {
    primary: {
      light: '#FDEDDD',
      main: '#190478',
      dark: '#190478',
      contrastText: '#fff',
    },
    secondary: {
      // light: '#ff7961',
      main: '#fff',
      // dark: '#ba000d',
      // contrastText: '#000',
    },
  },
  typography: {
    fontFamily: [
      'Quicksand', // Use Quicksand font for this style
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
});

function App() {
  const [displayStates, setDisplayStates] = useState({
    displayV: true,
    displayM: true,
    displayC: true,
    displayS: true,
    displayF: true,
  });

  const handleChange = (event) => {
    const { name, checked } = event.target;
    setDisplayStates(prevStates => ({
      ...prevStates,
      [name]: checked,
    }));
  };

  return (
    <div className="body quicksand-400">
      <ThemeProvider theme={theme}>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar className="top-navigation">
              <IconButton
                size="large"
                edge="start"
                color="primary"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" color="primary" sx={{ flexGrow: 1 }}>
                STinDer
              </Typography>
              <Button color="primary">Login</Button>
            </Toolbar>
          </AppBar>
          <>
            <div className="flex-container">
              <div className="profile-container">
                <div className="profile-inner-border"></div>
                <img src={profilePhoto} alt="Profile picture" className="profile-picture" />
              </div>
              <div className="flex items-center">
                <h2 className="username">Ethan</h2>
                {displayStates.displayV && <VerifiedIcon fontSize="large" className="badge-light" />}
                {displayStates.displayM && <Diversity3Icon fontSize="large" className="badge-light" />}
                {displayStates.displayC && <GavelIcon fontSize="large" className="badge-light" />}
                {displayStates.displayS && <MedicalInformationIcon fontSize="large" className="badge-light" />}
                {displayStates.displayF && <PregnantWomanIcon fontSize="large" className="badge-light" />}

              </div>
              <div className="settings-container">
                <h3>Verification Settings</h3>
                <Divider />
                <div className="section">
                  <div className="pos-abs">
                    <VerifiedIcon fontSize="large" className="badge-dark" />
                    <Switch
                      className="switch"
                      size="large"
                      name="displayV"
                      checked={displayStates.displayV}
                      onChange={handleChange}
                    />
                  </div>
                  <h3 className="h3-category">Identity Verification </h3>
                  <p>Strengthen the trustworthiness of profiles through verified personal identification.</p>
                  <div className="verify-button">
                    <Button variant="contained" endIcon={<ArrowForwardIcon />}>
                      Verify
                    </Button>
                  </div>
               </div>
                <Divider />
                <div className="section">
                  <div className="pos-abs">
                    <Diversity3Icon fontSize="large" className="badge-dark" />
                    <Switch
                      className="switch"
                      size="large"
                      name="displayM"
                      checked={displayStates.displayM}
                      onChange={handleChange}
                    />
                  </div>
                  <h3 className="h3-category">Marriage Status</h3>
                  <p>Verify your marital status to enhance trust with potential matches.</p>
                  <div className="verify-button">
                    <Button variant="outlined" endIcon={<CheckCircleOutlineIcon />}>
                      Verified
                    </Button>
                  </div>
                </div>
                <Divider />
                <div className="section">
                  <div className="pos-abs">
                    <GavelIcon fontSize="large" className="badge-dark" />
                    <Switch
                      className="switch"
                      size="large"
                      name="displayC"
                      checked={displayStates.displayC}
                      onChange={handleChange}
                    />
                  </div>
                  <h3 className="h3-category">Criminal Records</h3>
                  <p>Confirm a clean legal background to maintain a safe community.</p>
                  <div className="verify-button">
                    <Button variant="contained" endIcon={<ArrowForwardIcon />}>
                      Verify
                    </Button>
                  </div>
                </div>
                <Divider />
                <div className="section">
                  <div className="pos-abs">
                    <MedicalInformationIcon fontSize="large" className="badge-dark" />
                    <Switch
                      className="switch"
                      size="large"
                      name="displayS"
                      checked={displayStates.displayS}
                      onChange={handleChange}
                    />
                  </div>
                  <h3 className="h3-category">STD</h3>
                  <p>Share health status discreetly to ensure mutual safety and transparency.</p>
                  <div className="verify-button">
                    <Button variant="contained" endIcon={<ArrowForwardIcon />}>
                      Verify
                    </Button>
                  </div>
                </div>
                <Divider />
                <div className="section">
                  <div className="pos-abs">
                    <PregnantWomanIcon fontSize="large" className="badge-dark" />
                    <Switch
                      className="switch"
                      size="large"
                      name="displayF"
                      checked={displayStates.displayF}
                      onChange={handleChange}
                    />
                  </div>
                  <h3 className="h3-category">Fertility Measure</h3>
                  <p>Optional fertility information for those considering future family planning.</p>
                  <div className="verify-button">
                    <Button variant="contained" endIcon={<ArrowForwardIcon />}>
                      Verify
                    </Button>
                  </div>
                </div>
                <Divider />
              </div>
            </div>
          </>
        </Box>
        <div className="background"></div>
      </ThemeProvider>
    </div>
  );
}

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vitejs.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

export default App
