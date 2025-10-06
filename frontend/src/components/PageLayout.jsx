// src/components/PageLayout.jsx
import React from 'react';

// A LINHA 'import "../App.css";' FOI REMOVIDA DAQUI

const PageLayout = ({ children }) => (
  <div className="page-layout">
    <h1 className="app-title">Nutri Fácil</h1>
    {children}
  </div>
);

export default PageLayout;
