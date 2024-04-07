import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { FhenixClient, EncryptionTypes, getPermit } from "fhenixjs";
import { theme } from './utils/theme.js';
import ABI from './abi.js';
import SwipeCard from './components/common/SwipeCard.jsx';
import CustomAppBar from './components/common/AppBar.jsx';
import logo from '../public/logo.png'
import profilePhoto from './assets/profilePhoto.png'
import swipePhoto1 from './assets/swipePhoto1.jpg';
import './styles/styles.css';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Switch from '@mui/material/Switch';
import { ThemeProvider } from '@mui/material/styles';
import VerifiedIcon from '@mui/icons-material/Verified';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import GavelIcon from '@mui/icons-material/Gavel';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import CheckIcon from '@mui/icons-material/Check';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/FavoriteBorder';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

const walletAddress = '0xAe9952347606576BAfa7ED44434312df0F519Ea7';
const privateKeyDatingApp = '74a0f218c62ba96d19284ba2b4ba08f3aa763c32f707e7fbf57087b66a952d13';
const wallet = new ethers.Wallet(privateKeyDatingApp);

const providerUrl = 'https://api.testnet.fhenix.zone:7747/';
const provider2 = new ethers.providers.JsonRpcProvider(providerUrl);
const walletConnected = wallet.connect(provider2);

function App() {
  const [connected, setConnected] = useState(false);
  const [verifiedI, setVerifiedI] = useState(null);
  const [verifiedM, setVerifiedM] = useState(null);
  const [verifiedMTime, setVerifiedMTime] = useState(null);
  const [verifiedC, setVerifiedC] = useState(null);
  const [verifiedCTime, setVerifiedCTime] = useState(null);
  const [verifiedS, setVerifiedS] = useState(null);
  const [verifiedSTime, setVerifiedSTime] = useState(null);
  const [displayStates, setDisplayStates] = useState({
    displayV: true,
    displayM: true,
    displayC: true,
    displayS: true,
    displayF: true,
  });

  const [modalOpen, setModalOpen] = useState('settings');

  const contractAddress = '0xc7603D73A56F5bb4849cAA963032d8f350616C45'; // Address of the deployed contract

  const verificationDetails = {
    marriageStatus: {
      methodName: 'retrieveMarriageStatus',
      localStorageKey: 'retrieveMarriageStatus',
    },
    criminalRecord: {
      methodName: 'retrieveCriminalRecord',
      localStorageKey: 'retrieveCriminalRecord',
    },
    medicalData: {
      methodName: 'retrieveMedicalData',
      localStorageKey: 'retrieveMedicalData',
    },
  };

  useEffect(() => {
    const storedAccount = localStorage.getItem("selectedAccount");
    if (storedAccount) {
      setConnected(true);
    }
  }, []);

  useEffect(() => {
    const verifiedILocal = localStorage.getItem("retrieveIdentity");
    if (verifiedILocal) {
      setVerifiedI(verifiedILocal);
    }
  }, [modalOpen]);

  useEffect(() => {
    const verifiedMLocal = localStorage.getItem("retrieveMarriageStatus");
    if (verifiedMLocal) {
      const dataObject = JSON.parse(verifiedMLocal);
      const { data, timestamp } = dataObject;
      const getStatusString = (status) => {
        switch (status) {
          case '0':
            return "unknown";
          case '1':
            return "single";
          case '2':
            return "divorced";
          case '3':
            return "widowed";
          case '4':
            return "married";
          default:
            return "Unknown";
        }
      };
      setVerifiedM(`Result: Marriage status is ${getStatusString(data)}.`);
      setVerifiedMTime(`Verified on: ${new Date(timestamp).toLocaleString()}`);
    }
  }, [modalOpen]);

  useEffect(() => {
    const verifiedCLocal = localStorage.getItem("retrieveCriminalRecord");
    if (verifiedCLocal) {
      const dataObject = JSON.parse(verifiedCLocal);
      const { data, timestamp } = dataObject;
      const getStatusString = (status) => {
        switch (status) {
          case '0':
            return "Unknown";
          case '1':
            return "There is at least 1 criminal record.";
          case '2':
            return "There is NO criminal record.";
          default:
            return "Unknown";
        }
      };
      setVerifiedC(`Result: ${getStatusString(data)}`);
      setVerifiedCTime(`Verified on: ${new Date(timestamp).toLocaleString()}`);
    }
  }, [modalOpen]);

  useEffect(() => {
    const verifiedSLocal = localStorage.getItem("retrieveMedicalData");
    if (verifiedSLocal) {
      const dataObject = JSON.parse(verifiedSLocal);
      const { data, timestamp } = dataObject;
      const getStatusString = (status) => {
        switch (status) {
          case '0':
            return "Unknown";
          case '1':
            return "Tested positive for at least 1 out of 6 STDs.";
          case '2':
            return "Tested negative for all 6 STDs.";
          default:
            return "Unknown";
        }
      };
      setVerifiedS(`Result: ${getStatusString(data)}`);
      setVerifiedSTime(`Verified on: ${new Date(timestamp).toLocaleString()}`);
    }
  }, [modalOpen]);

  async function onVerifyIdentity() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, ABI, provider.getSigner());
      const storedAccount = localStorage.getItem("selectedAccount");
      const tx = await contract.approveViewingOfData(storedAccount);
      await tx.wait();
      console.log('Transaction successful:', tx.hash);
      localStorage.setItem("retrieveIdentity", tx.hash.toString());
      setModalOpen('settings');
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async function onGrantAccess(verificationType) {
    try {
      const { methodName, localStorageKey } = verificationDetails[verificationType];

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const client = new FhenixClient({ provider });
      const storedAccount = localStorage.getItem("selectedAccount");
      const contract = new ethers.Contract(contractAddress, ABI, provider.getSigner());
      const permit = await getPermit(contractAddress, provider);
      client.storePermit(permit);
      const permission = client.extractPermitPermission(permit);

      let response = await contract[methodName](storedAccount, permission);
      const plaintext = client.unseal(contractAddress, response);
      const timestamp = new Date().getTime();
      const dataWithTimestamp = {
        data: plaintext.toString(),
        timestamp,
      };

      localStorage.setItem(localStorageKey, JSON.stringify(dataWithTimestamp));
      console.log("Verification result:", plaintext.toString());
      setModalOpen('settings');
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async function connect() {
    if (!connected) {
      if (typeof window.ethereum !== "undefined") {
        console.log("MetaMask exists");
        try {
          let accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
          const selectedAccount = accounts[0];
          console.log(selectedAccount);
          console.log("Connected");
          localStorage.setItem("selectedAccount", selectedAccount);
          console.log("Account stored in local storage");
          setConnected(true);
        } catch (error) {
          console.error("Error connecting:", error);
        }
      } else {
        console.log("No MetaMask");
      }
    } else {
      try {
        localStorage.removeItem("selectedAccount");
        setConnected(false);
        console.log('connected false', connected);
        await window.ethereum.request({
          method: "wallet_requestPermissions",
          params: [
            {
              eth_accounts: {}
            }
          ]
        });
      } catch (error) {
        console.error("Error disconnecting:", error);
      }
    }
  }

  const handleOpenModal = (modal) => {
    setModalOpen(modal);
  };

  const handleCloseModal = () => {
    setModalOpen('settings');
  };

  const handleChange = (event) => {
    const { name, checked } = event.target;
    setDisplayStates(prevStates => ({
      ...prevStates,
      [name]: checked,
    }));
  };

  const grandAccess = (event) => {

  };

  const defaultVerifyText = `We'll use a smart contract connected for verification. By granting access, you authorize this contract to confirm your identity and proceed with the requested verification.`;

  const VerifyModal = ({ heading, text, text2, onGrantAccess }) => {

    return (
      <div className="settings-container">
        <h2>{heading}</h2>
        <p>{text}</p>
        <p>{text2}</p>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 1 }}>
          <Button variant="contained" onClick={onGrantAccess}>Grant Access</Button>
          <Button variant="outlined" onClick={handleCloseModal} sx={{ ml: 2 }}>Back</Button>
        </Box>
      </div>
    );
  };

  return (
    <div className="body quicksand-400">
      <ThemeProvider theme={theme}>
        <Box sx={{ flexGrow: 1 }}>
          <CustomAppBar
            connected={connected}
            onSwipeClick={() => setModalOpen('swipe')}
            onVerificationsClick={() => setModalOpen('settings')}
            onConnectClick={connect}
          />
          <>
            <div className="flex-container">
              {modalOpen == 'swipe' &&
                <SwipeCard name="Jamie" photo={swipePhoto1} />
              }
              {modalOpen !== 'swipe' && <div>
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
                </div>
              </div>}
              {modalOpen == 'i' && verifiedI == null &&
                <VerifyModal
                  heading="Verify Your Identity"
                  text={defaultVerifyText}
                  text2=""
                  onGrantAccess={onVerifyIdentity}
                />}
              {modalOpen == 'i' && verifiedI !== null &&
                <VerifyModal
                  heading="Your Identity Has Been Verified."
                  text="Result: Success"
                  text2=""
                  onGrantAccess={onVerifyIdentity}
                />}
              {modalOpen == 'm' && verifiedM == null &&
                <VerifyModal
                  heading="Verify Your Marriage Status"
                  text={defaultVerifyText}
                  text2=""
                  onGrantAccess={() => onGrantAccess('marriageStatus')}
                />}
              {modalOpen == 'm' && verifiedM !== null &&
                <VerifyModal
                  heading="Your Marriage Status Has Been Verified."
                  text={verifiedMTime}
                  text2={verifiedM}
                  onGrantAccess={() => onGrantAccess('marriageStatus')}
                />}
              {modalOpen == 'c' && verifiedC == null &&
                <VerifyModal
                  heading="Verify Your Criminal Records"
                  text={defaultVerifyText}
                  text2=""
                  onGrantAccess={() => onGrantAccess('criminalRecord')}
                />}
              {modalOpen == 'c' && verifiedC !== null &&
                <VerifyModal
                  heading="Your Marriage Status Has Been Verified."
                  text={verifiedCTime}
                  text2={verifiedC}
                  onGrantAccess={() => onGrantAccess('medicalData')}
                />}
              {modalOpen == 's' && verifiedS == null &&
                <VerifyModal
                  heading="Verify Your STD Status"
                  text={defaultVerifyText}
                  text2=""
                  onGrantAccess={() => onGrantAccess('medicalData')}
                />}
              {modalOpen == 's' && verifiedS !== null &&
                <VerifyModal
                  heading="Your Marriage Status Has Been Verified."
                  text={verifiedSTime}
                  text2={verifiedS}
                  onGrantAccess={onGrantAccessS}
                />}
              {modalOpen == 'settings' &&
                <div className="settings-container">
                  <h2>My Verifications</h2>
                  <Divider />
                  <br />
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
                    <p>{verifiedI == null && 'Strengthen the trustworthiness of profiles through verified personal identification.'}</p>
                    <p>{verifiedI !== null && 'Result: Success'}</p>
                    <div className="verify-button">
                      {verifiedI == null ?
                        <Button variant="contained" endIcon={<CheckIcon />} onClick={() => handleOpenModal('i')}>
                          Verify
                        </Button> :
                        <Button variant="outlined" endIcon={<CheckIcon />} onClick={() => handleOpenModal('i')}>
                          Verified
                        </Button>
                      }
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
                    <p>{verifiedM == null && 'Verify your marital status to enhance trust with potential matches.'}</p>
                    <p>{verifiedMTime !== null && verifiedMTime}</p>
                    <p>{verifiedM !== null && verifiedM}</p>
                    <div className="verify-button">
                      {verifiedM == null ?
                        <Button variant="contained" endIcon={<CheckIcon />} onClick={() => handleOpenModal('m')}>
                          Verify
                        </Button> :
                        <Button variant="outlined" endIcon={<CheckIcon />} onClick={() => handleOpenModal('m')}>
                          Verified
                        </Button>
                      }
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
                    <p>{verifiedC == null && 'Confirm a clean legal background to maintain a safe community.'}</p>
                    <p>{verifiedCTime !== null && verifiedCTime}</p>
                    <p>{verifiedC !== null && verifiedC}</p>
                    <div className="verify-button">
                      {verifiedC == null ?
                        <Button variant="contained" endIcon={<CheckIcon />} onClick={() => handleOpenModal('c')}>
                          Verify
                        </Button> :
                        <Button variant="outlined" endIcon={<CheckIcon />} onClick={() => handleOpenModal('c')}>
                          Verified
                        </Button>
                      }
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
                    <p>{verifiedS == null && 'Share health status discreetly to ensure mutual safety and transparency.'}</p>
                    <p>{verifiedSTime !== null && verifiedSTime}</p>
                    <p>{verifiedS !== null && verifiedS}</p>
                    <div className="verify-button">
                      {verifiedS == null ?
                        <Button variant="contained" endIcon={<CheckIcon />} onClick={() => handleOpenModal('s')}>
                          Verify
                        </Button> :
                        <Button variant="outlined" endIcon={<CheckIcon />} onClick={() => handleOpenModal('s')}>
                          Verified
                        </Button>
                      }
                    </div>
                  </div>
                  <Divider />
                  <br />
                </div>
              }
            </div>
          </>
        </Box>
        <div className="background"></div>
      </ThemeProvider>
    </div>
  );
}

export default App
