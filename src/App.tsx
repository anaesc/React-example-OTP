import React from "react";

import { Router } from "@reach/router";

import Home from "./routes/Home";
import Result from "./routes/Result";
import OTP from "./routes/OTP";

import { AppProvider } from "./context/AppContext";

import "normalize.css";
import "./styles.scss";

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Home path="/" />
        <OTP path="/otp" />
        <Result path="/result" />
      </Router>
    </AppProvider>
  );
}
