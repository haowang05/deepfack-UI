import React from 'react';
import './Header.css'; 

export const Header: React.FC = () => {
  return (
    <header className="site-header">
      <div className="header-logo">
        <span className="logo-block">B</span>
        <span className="logo-block">B</span>
        <span className="logo-block">C</span>
        <span className="logo-text">R&D</span>
      </div>
    </header>
  );
};