import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { create } from 'ipfs-http-client'; // Import IPFS client
import './App.css';
import abi from './utils/WavePortal.json';
// const ipfsClient = require('ipfs-http-client');
// const express = require('express');
// const bodyParser = require('body-parser');
// const fileUpload = require('express-fileupload'); 
// const fs = require('fs');

export default function MainPage() {

  const [currentAccount, setCurrentAccount] = useState("");
  const [file, setFile] = useState(null);
  const [waves, setWaves] = useState([]);
  const contractAddress = "0xBFf363Dd1BB69737688e103d83bA6CaBFe05774F"
  const contractABI = abi.abi;

  // const ipfs = new ipfsClient({ host: 'localhost', port: 5001, protocol: 'https' });
  // const app = express();

  // app.set('view engine', 'ejs');
  // app.use(bodyParser.urlencoded({ extended: true }));
  // app.use(fileUpload());

  // app.get('/', (req, res) => {
  //   res.render('home');
  // });

  // app.post('/upload', (req, res) => {
  //   const file = req.files.file;
  //   const fileName = req.body.fileName;
  //   const filePath = 'files/' + fileName;

  //   file.mv(filePath, async (err) => {
  //     if (err) {
  //       console.log("error uploading file");
  //       return res.status(500).send(err);
  //     }

  //     const fileHash = await addFile(fileName, filePath);
  //     fs.unlink(filePath, (err) => {
  //       if (err) console.log(err);
  //     });

  //     res.render('upload', { fileName, fileHash });
  //   });
  // });

  // const addFile = async (fileName, filePath) => {
  //   const file = fs.readFileSync(filePath);
  //   const fileAdded = ipfs.add({ path: fileName, content: file });
  //   const fileHash = fileAdded[0].hash;

  //   return fileHash;
  // }

  // app.listen(3000, () => {
  //   console.log('Server is running on port 3000');
  // });

  //const ipfs = create(); // Initialize IPFS client

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    setFile(file);
};

  const CheckIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }
  
      const accounts = await ethereum.request({ method: 'eth_accounts' });
  
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found")
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
    getAllWaves();
  }, [])
    const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        const waveTxn = await wavePortalContract.wave("hello, this is my message from my react app");
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        getAllWaves();
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getAllWaves = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        const waves = await wavePortalContract.getAllWaves();

        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        setWaves(wavesCleaned);
        console.log(wavesCleaned);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // const uploadToIPFS = async () => {
  //   try {
  //     const fileData = await ipfs.add(file); // Upload file to IPFS
  //     console.log("File uploaded to IPFS:", fileData.path);
  //     // Handle the file data as needed, e.g., store the IPFS hash in a smart contract
  //   } catch (error) {
  //     console.log("Error uploading file to IPFS:", error);
  //   }
  // };
  
  return (
    <div className="mainContainer">
  <div className="dataContainer">
    <div className="header">
      👋 Hey there!
    </div>
    {!currentAccount && (
      <button className="waveButton" onClick={ConnectWallet}>
        Connect Wallet
      </button>
    )}
    <button className="waveButton" onClick={wave}>
      Wave at Me
    </button>
    <div class="documentManagement">
      <h1>Document Management</h1>
      <div>
        <label>Upload Document:</label>
        <input type="file" onChange={handleFileChange}/>
        <button onClick={uploadToIPFS}>Upload</button>
      </div>
    </div>
  </div>
</div>

    
  );
}
