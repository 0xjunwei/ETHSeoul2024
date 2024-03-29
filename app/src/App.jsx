// import { useState } from 'react'
import './App.css'
import './styles.css'; // Import the CSS file
import profilePhoto from './assets/profilePhoto.png'

function App() {
  return (
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
      </div>
    </>
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
