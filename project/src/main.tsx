import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { AuthProvider } from "./contexts/AuthContext";
import { LoanProvider } from "./contexts/LoanContext";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <LoanProvider>
          <App />
        </LoanProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
