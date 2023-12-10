import React from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home, GrantDetails, CreateGrant, Profile, Registration, LandingPage } from "./pages";
import { Navbar, Sidebar, Footer } from "./components"
import { BackdropSurface, Portal, Card } from '@ensdomains/thorin'

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <BrowserRouter>
        <div className="flex flex-1 relative sm:-8 p-4 bg-[#fff] flex-row">
          <div className="sm:flex hidden mr-10 relative">
            <Sidebar />
          </div>
          <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
            <Navbar />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/Home" element={<Home />} />
              <Route path="/grant-details/:id" element={<GrantDetails />} />
              <Route path="/create-grant" element={<CreateGrant />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/registration" element={<Registration />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
