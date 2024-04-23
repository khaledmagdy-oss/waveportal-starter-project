import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import MainPage from './MainPage';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

ReactDOM.render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/main" element={<MainPage />} />
        {/* Add more routes here */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>,
    document.getElementById('root')
  );
