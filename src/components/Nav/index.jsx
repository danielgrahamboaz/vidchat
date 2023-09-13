import React from "react";
import "./nav.css";

const Navbar = () => {
  return (
    <div class="header">
      <nav
        class="navbar bd-navbar navbar has-shadow has-background-black has-text-white"
        role="navigation"
        aria-label="main navigation"
      >
        <div class="container">
          <div class="navbar-brand">
            <a class="navbar-item logoText" href="/">
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
