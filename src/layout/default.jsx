import React from "react";
import { Navbar, Footer } from "../components";
import { Outlet } from "react-router-dom";
import "../index.css";

const DefaultLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default DefaultLayout;
