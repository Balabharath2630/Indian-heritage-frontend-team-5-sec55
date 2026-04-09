import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="app-footer">
      <nav className="footer-nav">
        <Link to="/">Home</Link>
        <Link to="/monuments">Monuments</Link>
        <Link to="/forum">Forum</Link>
        <Link to="/login">Login</Link>
        <Link to="/signup">Sign Up</Link>
      </nav>
      <div className="footer-copy">© {new Date().getFullYear()}</div>
    </footer>
  );
}