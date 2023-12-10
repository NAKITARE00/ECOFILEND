import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { Mumbai, AvalancheFuji } from "@thirdweb-dev/chains";
import { ThirdwebConfigProvider } from "@thirdweb-dev/react";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { BrowserRouter as Router } from 'react-router-dom';
import "./index.css";
import { StateContextProvider } from "./context";
import { ThemeProvider } from 'styled-components'
import { ThorinGlobalStyles, lightTheme } from '@ensdomains/thorin'


const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <ThirdwebProvider
      clientId={import.meta.env.VITE_TEMPLATE_CLIENT_ID}
      activeChain={AvalancheFuji}
    >
      <StateContextProvider>
        <ThemeProvider theme={lightTheme}>
          <ThorinGlobalStyles />
          <App />
        </ThemeProvider>
      </StateContextProvider>
    </ThirdwebProvider>
  </React.StrictMode >
);
