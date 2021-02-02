import React from "react";
import Routes from "routes";
import UserProvider from "./UserContext";

const Contexts = () => (
  <UserProvider>
    <Routes />
  </UserProvider>
);

export default Contexts;
