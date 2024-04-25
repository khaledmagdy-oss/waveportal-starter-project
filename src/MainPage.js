import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/WavePortal.json';
import axios from 'axios';
import Navbar from "./components/Navbar";
import { useNavigate } from "react-router-dom";
const FormData = require('form-data')



export default function MainPage() {

  const [currentAccount, setCurrentAccount] = useState("");
  const [file, setFile] = useState(null);
  //const [waves, setWaves] = useState([]);
  const [hash, setHash] = useState("");
  const contractAddress = "0xFf33B97247c8d3549967AD4d99C24f17a351bd3A"
  const contractABI = abi.abi;
  const Navigate = useNavigate();

  const [state, setState] = React.useState({
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
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("metamask connected!");
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Wallet connected:", account);
        setCurrentAccount(account);
      } else {
        console.log("Please connect your wallet")
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
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    CheckIfWalletIsConnected();
    // getAllWaves();
    checkIfLoggedIn();
    //remove when you implement the whatsapp template
  }, [])

  const upload = async (hash) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        console.log("local email: %s, email: %s, hash: %s", localStorage.getItem("email"), state.email, hash);
        if (localStorage.getItem("email") && state.email && hash) {
          await wavePortalContract.uploadFile(hash, localStorage.getItem("email"), state.email);
          console.log("Uploaded file to blockchain");
        }
        else {
          console.log("Please fill in all the fields");
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  //   const wave = async () => {
  //   try {
  //     const { ethereum } = window;

  //     if (ethereum) {
  //       const provider = new ethers.providers.Web3Provider(ethereum);
  //       const signer = provider.getSigner();
  //       const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

  //       let count = await wavePortalContract.getTotalWaves();
  //       console.log("Retrieved total wave count...", count.toNumber());

  //       const waveTxn = await wavePortalContract.wave("hello, this is my message from my react app");
  //       console.log("Mining...", waveTxn.hash);

  //       await waveTxn.wait();
  //       console.log("Mined -- ", waveTxn.hash);

  //       count = await wavePortalContract.getTotalWaves();
  //       console.log("Retrieved total wave count...", count.toNumber());
  //       getAllWaves();
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // const getAllWaves = async () => {
  //   try {
  //     const { ethereum } = window;

  //     if (ethereum) {
  //       const provider = new ethers.providers.Web3Provider(ethereum);
  //       const signer = provider.getSigner();
  //       const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

  //       const waves = await wavePortalContract.getAllWaves();

  //       let wavesCleaned = [];
  //       waves.forEach(wave => {
  //         wavesCleaned.push({
  //           address: wave.waver,
  //           timestamp: new Date(wave.timestamp * 1000),
  //           message: wave.message
  //         });
  //       });

  //       setWaves(wavesCleaned);
  //       console.log(wavesCleaned);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  const fileInputRef = React.useRef();

  const pinFileToIPFS = async () => {
    try {
      if (!file) {
        console.log("No file selected");
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
      console.log(res.data);
      console.log(
        `View the file here: https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`
      );
      const hash = res.data.IpfsHash;
      setHash(hash);
      upload(hash);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleClick = () => {
    Navigate("/chats"); // Navigate to the "/chats" route
  };


  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <br /><br /><br /><br /><br /><br /><br />
      <Navbar />
        <div className="headerMain">
          👋 Hey there! {localStorage.getItem("email")}
        </div>
        {!currentAccount && (
          <button className="waveButton" onClick={ConnectWallet}>
            Connect Wallet
          </button>
        )}
        <div className="documentManagement">
          <h1>Send Files</h1>
          <div>
            <label>Upload Document:</label>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} />
            <label>Send To:</label>
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={state.email}
              onChange={handleChange}
            />
            <button onClick={pinFileToIPFS}>Upload</button>
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


  );
}
