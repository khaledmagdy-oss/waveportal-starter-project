import "./Chats.css";
import Navbar from "./components/Navbar";
import { ethers } from "ethers";
import abi from './utils/WavePortal.json';
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import chatBackground from './chatBackground.jpg';
import background from './background.png';


export default function Chats() {
    const contractAddress = "0x5db2A1a29373F6CF0c2920B1567F94BFD4AF6cBA"
    const contractABI = abi.abi;
    const [chat, setChat] = useState([]);
    const [chatBoxes, setChatBoxes] = useState([]);
    const [sender, setSender] = useState("");
    const [searchInput, setSearchInput] = useState("");

    useEffect(() => {
        checkIfLoggedIn();
        retrieve();
    }, [])

    const handleInputChange = (event) => {
        setSearchInput(event.target.value);
        search();
    };

    const checkIfLoggedIn = async () => {
        if (localStorage.getItem("email") == null) {
            window.location.href = "/";
        }
    }

    const search = async () => {
        try {
            const { ethereum } = window;
            let chats = []
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

                let files = []
                //email is hardcoded change it when you implement the whatsapp template
                files = await wavePortalContract.getAllFilesForRecipient(localStorage.getItem("email"));
                files.forEach(file => {
                    if (file.sender.includes(searchInput) && !chats.includes(file.sender))
                        chats.push(file.sender);
                });
                setChatBoxes(chats);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const retrieve = async () => {
        try {
            const { ethereum } = window;
            let chats = []
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

                let files = []
                //email is hardcoded change it when you implement the whatsapp template
                files = await wavePortalContract.getAllFilesForRecipient(localStorage.getItem("email"));
                files.forEach(file => {
                    if (!chats.includes(file.sender))
                        chats.push(file.sender);
                });
                setChatBoxes(chats);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            // Call the search function with the current input value when Enter key is pressed
            search(searchInput);
        }
        if (event.key === 'Backspace') {
            // Call the search function with the current input value when Enter key is pressed
            search(searchInput);
        }
        if (event.key) {
            // Call the search function with the current input value when Enter key is pressed
            search(searchInput);
        }
        if (searchInput === "") {
            search(searchInput);
        }
    };
    search();

    const handleChatBoxClick = async (chatBox) => {
        try {
            const { ethereum } = window;
            let messages = []
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

                let files = []
                setSender(chatBox);
                //email is hardcoded change it when you implement the whatsapp template
                files = await wavePortalContract.getAllFilesForRecipient(localStorage.getItem("email"));
                files.forEach(file => {
                    if (file.sender == chatBox)
                        messages.push(file);
                });
                setChat(messages);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (

        <div style={{ backgroundImage: `url(${background})` }}>
            <div>
                <br />
                <Navbar />
                <br />
            </div>
            {/* HTML Content */}
            <div className="background-green"></div>
            <div className="main-container">
                <div className="left-container">
                    {/* Header */}
                    {/* <div className="header">
                        <div className="user-img">
                            <img className="dp" src="https://www.codewithfaraz.com/InstaPic.png" alt="" />
                        </div>
                        <div className="nav-icons">
                            <li><i className="fa-solid fa-users"></i></li>
                            <li><i className="fa-solid fa-message"></i></li>
                            <li><i className="fa-solid fa-ellipsis-vertical"></i></li>
                        </div>
                    </div> */}

                    {/* Notification */}
                    <div className="notif-box">
                        <div>
                            <span className="text-top">chats</span>
                        </div>
                    </div>

                    {/* Search container */}
                    <div className="search-container">
                        <div className="input">
                            <i className="fa-solid fa-magnifying-glass"></i>
                            <input
                                type="text"
                                placeholder="Search for a chat"
                                value={searchInput}
                                onChange={handleInputChange}
                                onKeyPress={handleKeyPress}
                            />
                        </div>
                    </div>

                    {/* Chats */}
                    <div className="chat-list">
                        {chatBoxes.map((chatBox, index) => (
                            <div className="chat-box" key={index} onClick={() => handleChatBoxClick(chatBox)}>
                                <br /><br />
                                <div className="chat-details">
                                    <div className="text-head" style={{ fontFamily: 'Courier New, Courier, monospace', fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
                                        {chatBox}
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>

                <div className="right-container">
                    {/* Header */}
                    <div className="header">
                        <div className="img-text">

                            <h4 style={{ fontFamily: 'Courier New, Courier, monospace', fontSize: '20px', fontWeight: 'bold', color: '#FFF' }}>{sender}<br /></h4>
                        </div>
                    </div>

                    {/* Chat container */}
                    <div className="chat-container" style={{ backgroundImage: `url(${chatBackground})` }}>
                        {/* <img src="/chatBackground.jpg" alt="background" /> */}
                        {chat.map((file, index) => (
                            <div className="chat-box" key={index}>
                                <div className="chat-details">
                                    <div className="text-head">
                                        
                                        <div className="link-box">
                                            <Link to={`https://gateway.pinata.cloud/ipfs/${file.ipfsHash}`} target="_blank" className="custom-link">
                                                {file.title}
                                            </Link>
                                        </div>

                                        
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input bottom */}

                </div>
            </div>
        </div>
    );
}