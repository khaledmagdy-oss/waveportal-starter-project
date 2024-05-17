import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/WavePortal.json';
import axios from 'axios';
import Navbar from "./components/Navbar";
import { useNavigate } from "react-router-dom";
import background from './background.png';
import loadingIndicator from './loading.gif'


const FormData = require('form-data')

export default function MainPage() {

  const [currentAccount, setCurrentAccount] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const contractAddress = "0xeE7F6142a3E624AC6Cbd186a34176F4C703F283c"
  const contractABI = abi.abi;
  const Navigate = useNavigate();


  const [state, setState] = React.useState({
    description: "",
    email: ""
  });

  const handleChange = evt => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    setFile(file);
  };

  const checkIfLoggedIn = async () => {
    if (localStorage.getItem("email") == null) {
      window.location.href = "/";
    }
  }

  const CheckIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Make sure you have your wallet's browser extension enabled!");
        return;
      } else {
        console.log("wallet connected!");
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Wallet connected:", account);
        setCurrentAccount(account);
      } else {
        alert("Please connect your wallet")
      }
    }
    catch (error) {
      console.log(error);
    }

  }

  const ConnectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get a crypto wallet!");
        return;
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

      console.log("Connected", accounts[0]);
      alert("Wallet connected!");
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    CheckIfWalletIsConnected();
    checkIfLoggedIn();
  }, [])

  const upload = async (hash) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        if (localStorage.getItem("email") && state.email && hash) {
          await wavePortalContract.uploadFile(state.description, hash, localStorage.getItem("email"), state.email);
          alert("File has been uploaded successfully!");
        }
        else {
          alert("Please fill in all the fields");
        }
      }
      setLoading(false)
    } catch (error) {
      console.log(error);
    }
  }

  const fileInputRef = React.useRef();

  const pinFileToIPFS = async () => {
    try {
      setLoading("true")
      if (!file) {
        alert("No file selected");
        return;
      }
      if (!state.email) {
        alert("No email entered");
        return;
      }
      if (!state.description) {
        alert("No description entered");
        return;
      }

      let data = new FormData();
      data.append("file", file);
      data.append("pinataOptions", '{"cidVersion": 0}');
      data.append("pinataMetadata", '{"name": "uploaded_file"}');
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data,
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI5YWU4MjRhOS03NTZiLTRiMDItODQyNi02Yzc3N2ZjOGU2NDAiLCJlbWFpbCI6ImtoYWxlZF9tYWdkeTAyQGhvdG1haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjRiMzU3MTlmOTg3OTM0YWQwNTkxIiwic2NvcGVkS2V5U2VjcmV0IjoiNTg1MjE0OTlhMTQyYmM4NDc2ZThjMTY4NmY1NDYwZThmNWNmOWFkN2M1MTAwNDExMjc2OWFmYzJiODhlMDMxYSIsImlhdCI6MTcxMzk2MjU3Mn0.ryodOTG455nOQrL1Pz5p_raRsvsYn_V_nP7bLI3AF2g`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const hash = res.data.IpfsHash;
      await upload(hash);
      setLoading(false)
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  };
  const handleClick = () => {
    if (currentAccount)
      Navigate("/chats"); // Navigate to the "/chats" route
    else
      alert("Please connect your wallet");
  };


  return (
    <div className="mainPage" style={{ backgroundImage: `url(${background})` }}>
      <div className="mainContainer">
        <div className="dataContainer">
          <br />
          <Navbar />
          <br /><br />
          <div className="headerMain">
            👋 Hey there! <br /> {localStorage.getItem("email")}
          </div>
          {!currentAccount && (
            <button className="waveButton" onClick={ConnectWallet}>
              Connect Wallet
            </button>
          )}
          <div className="documentManagement">
            <h1>Send Files</h1>
            <div>
              <br />
              <label>File Description:</label>
              <input
                type="text"
                name="description"
                value={state.name}
                onChange={handleChange}
                placeholder="Description"
                required
              />
              <label>Choose File:</label>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} />
              <br />
              <label>Send To:</label>
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={state.email}
                onChange={handleChange}
                required
              />
              <br />
              {loading && (
                <div className="loading-spinner">
                  <div className="spinner-border" role="status">
                    <img src={(loadingIndicator)} alt="Loading..." />
                  </div>
                </div>
              )}
              <button onClick={pinFileToIPFS}>Send</button>
            </div>
            <div className="documentManagement">
              <h1>View Chats</h1>
              <div>
                <button onClick={handleClick} >--{">"}</button>
              </div>
              <br /><br /><br /><br /><br />
            </div>
          </div>
        </div>
      </div>
    </div>



  );
}
