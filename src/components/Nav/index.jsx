import React from "react";
import "./nav.css";

const Navbar = () => {
  return (
    <div className="header">
      <nav
        className="navbar bd-navbar navbar has-shadow has-background-black has-text-white"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="container">
          <div className="navbar-brand">
            <a className="navbar-item logoText" href="/">
              <input type="hidden" name="_csrf" value="<%= csrfToken %>" />
              VidChat
            </a>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
