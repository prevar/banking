import React from "react";
import { BrowserRouter, Routes, Link, Route } from "react-router-dom";
import Login from "./Login";
import Home from "./Home";
import CreateAccount from "./CreateAccount";
import Administer from "./Administer";
import Deposit from "./Deposit";
import Withdraw from "./Withdraw";
import AllData from "./AllData";
import Transfer from "./Transfer";
import Logout from "./Logout";
import { useAppContext } from "./AppContext";

const AppRouter = () => {
  const { isAdmin, loggedInEmail } = useAppContext();
  return (
    <BrowserRouter>
      <div className="container">
        <div id="linksContainer" className="container text-end">
          <div id="links" className="showlinks">
            <Link
              className={loggedInEmail ? "show nav-btn" : "hide"}
              to="/Home"
            >
              Home
            </Link>
            <Link
              className={isAdmin && loggedInEmail ? "show nav-btn" : "hide"}
              to="/CreateAccount"
            >
              Create Account
            </Link>
            <Link
              className={isAdmin && loggedInEmail ? "show nav-btn" : "hide"}
              to="/Administer"
            >
              Administer an account
            </Link>
            <Link
              className={!isAdmin && loggedInEmail ? "show nav-btn" : "hide"}
              to="/Deposit"
            >
              Deposit
            </Link>
            <Link
              className={!isAdmin && loggedInEmail ? "show nav-btn" : "hide"}
              to="/Withdraw"
            >
              Withdraw
            </Link>
            <Link
              className={!isAdmin && loggedInEmail ? "show nav-btn" : "hide"}
              to="/Transfer"
            >
              Transfer
            </Link>
            <Link
              className={loggedInEmail && !isAdmin ? "show nav-btn" : "hide"}
              to="/AllData"
            >
              Transaction History
            </Link>
            <Link
              className={loggedInEmail ? "show nav-btn" : "hide"}
              to="/Logout"
            >
              Logout
            </Link>
          </div>
        </div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/CreateAccount" element={<CreateAccount />} />
          <Route path="/Administer" element={<Administer />} />
          <Route path="/Deposit" element={<Deposit />} />
          <Route path="/Withdraw" element={<Withdraw />} />
          <Route path="/Transfer" element={<Transfer />} />
          <Route path="/AllData" element={<AllData />} />
          <Route path="/Logout" element={<Logout />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default AppRouter;
