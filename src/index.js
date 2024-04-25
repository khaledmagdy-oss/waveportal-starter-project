import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import MainPage from './MainPage';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import process from 'process';
import Chats from './Chats';
window.process = process;

ReactDOM.render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/chats" element={<Chats />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>,
    document.getElementById('root')
  );
