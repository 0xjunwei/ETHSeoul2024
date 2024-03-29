import * as React from 'react';
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
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      light: '#FDEDDD',
      main: '#190478',
      dark: '#190478',
      contrastText: '#fff',
    },
    // secondary: {
    //   light: '#ff7961',
    //   main: '#f44336',
    //   dark: '#ba000d',
    //   contrastText: '#000',
    // },
  },
});

function App() {
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
                <span className="username">ETHAN</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="icon text-blue-500 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" className="icon text-green-500 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="settings-container">
                <h3>Verification Settings</h3>
                <Divider />
                <div className="section">
                  <h3>Marriage Status</h3>
                  <p>Verify your marital status to enhance trust with potential matches.</p>
                </div>
                <Divider />
                <div className="section">
                  <h3>Criminal Records</h3>
                  <p>Confirm a clean legal background to maintain a safe community.</p>
                </div>
                <Divider />
                <div className="section">
                  <h3>STD</h3>
                  <p>Share health status discreetly to ensure mutual safety and transparency.</p>
                </div>
                <Divider />
                <div className="section">
                  <h3>Fertility Measure</h3>
                  <p>Optional fertility information for those considering future family planning.</p>
                </div>
                <Divider />
                <div className="section">
                  <h3>Hidden Rating System</h3>
                  <p>Contribute to the community's integrity by rating interactions anonymously.</p>
                </div>

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
