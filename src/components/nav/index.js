import React from "react";
import { Link } from "react-router-dom";
import "./index.css";

function Nav() {
  return (
    <>
      <nav className="navbar">
        <Link to="/">Home</Link>
        <Link to="/users">Users</Link>
      </nav>
    </>
  );
}

export default Nav;
