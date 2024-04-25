import "./Chats.css";
import Navbar from "./components/Navbar";
import { ethers } from "ethers";
import abi from './utils/WavePortal.json';
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Chats() {
    const contractAddress = "0xFf33B97247c8d3549967AD4d99C24f17a351bd3A"
    const contractABI = abi.abi;
    const [retrievedFiles, setRetrievedFiles] = useState([]);
    const [chat, setChat] = useState([]);
    const [chatBoxes, setChatBoxes] = useState([]);

    useEffect(() => {
        checkIfLoggedIn();
        retrieve();
    }, [])

    const checkIfLoggedIn = async () => {
        if (localStorage.getItem("email") == null) {
            window.location.href = "/";
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
                    if(!chats.includes(file.sender))
                        chats.push(file.sender);
                });
                setChatBoxes(chats);
            }
        } catch (error) {
        }
    }

    const handleChatBoxClick = async (chatBox) => {
        try {
            const { ethereum } = window;
            let messages = []
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

                let files = []
                //email is hardcoded change it when you implement the whatsapp template
                files = await wavePortalContract.getAllFilesForRecipient(localStorage.getItem("email"));
                files.forEach(file => {
                    if(file.sender == chatBox)
                        messages.push(`https://gateway.pinata.cloud/ipfs/${file.ipfsHash}`);
                });
                setChat(messages);
            }
        } catch (error) {
        }
    }

    return (

        <div>
            <div>
                <br /><br />
                <Navbar />
            </div>
            {/* HTML Content */}
            <div className="background-green"></div>
            <div className="main-container">
                <div className="left-container">
                    {/* Header */}
                    <div className="header">
                        <div className="user-img">
                            <img className="dp" src="https://www.codewithfaraz.com/InstaPic.png" alt="" />
                        </div>
                        <div className="nav-icons">
                            <li><i className="fa-solid fa-users"></i></li>
                            <li><i className="fa-solid fa-message"></i></li>
                            <li><i className="fa-solid fa-ellipsis-vertical"></i></li>
                        </div>
                    </div>

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
                            <input type="text" placeholder="Search for a chat" />
                        </div>
                        <i className="fa-sharp fa-solid fa-bars-filter"></i>
                    </div>

                    {/* Chats */}
                    <div className="chat-list">
                    {chatBoxes.map((chatBox, index) => (
                            <div className="chat-box" key={index} onClick={() => handleChatBoxClick(chatBox)}>
                                <div className="chat-details">
                                    <div className="text-head">
                                        <h4>{chatBox}</h4>
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

                            <h4>Email here<br /></h4>
                        </div>
                    </div>

                    {/* Chat container */}
                    <div className="chat-container">
                    {chat.map((text, index) => (
                            <div className="chat-box" key={index}>
                                <div className="chat-details">
                                    <div className="text-head">
                                        <Link to={text} target="_blank" className="custom-link">{text}</Link>
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