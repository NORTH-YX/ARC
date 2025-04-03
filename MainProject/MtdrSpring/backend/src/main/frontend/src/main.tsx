import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { ConfigProvider } from "antd";
import App from "./App.tsx";
import "./App.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router basename="/">
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#C74634",
            fontFamily: "Poppins, sans-serif",
          },
        }}
      >
        <App />
      </ConfigProvider>
    </Router>
  </StrictMode>
);
