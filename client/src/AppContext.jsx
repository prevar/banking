import React, { createContext, useContext, useState } from "react";

const AppContext = createContext();
const useAppContext = () => useContext(AppContext);

//Following values to be stored in the context so they are available throughout the app
const AppProvider = ({ children }) => {
  const [loggedInEmail, setLoggedInEmail] = useState(null); //Email of the person logged in
  const [isAdmin, setIsAdmin] = useState(false); //Whether logged in user has ADMIN role and is an admin

  const [userId, setUserId] = useState(null); // user id of the person whose account is being viewed. in case of admin, this is set after the administer screen
  const [userEmail, setUserEmail] = useState(null); // email of the user whose account is being viewed
  const [userBalance, setUserBalance] = useState(0); // balance of the user whose account is being viewed
  const [userHistory, setUserHistory] = useState([]); // history of the user whose account is being viewed
  const [userRoles, setUserRoles] = useState([]); // roles of the user whose account is being viewed
  const [users, setUsers] = useState([]);

  const contextValue = {
    loggedInEmail,
    setLoggedInEmail,
    isAdmin,
    setIsAdmin,
    userId,
    setUserId,
    userEmail,
    setUserEmail,
    userBalance,
    setUserBalance,
    userHistory,
    setUserHistory,
    userRoles,
    setUserRoles,
    users,
    setUsers,
  };
  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

//Card used by all js files to display on the screen
export function Card(props) {
  function classes() {
    const bg = props.bgcolor ? " bg-" + props.bgcolor : " ";
    const txt = props.txtcolor ? " text-" + props.txtcolor : " text-white";
    return "card align-self-start mx-auto" + bg + txt;
  }
  //Make the CSS class for to show color red in case of ERROR and green in case of SUCCESS
  const statusColor = props.status
    ? props.status.indexOf("ERROR") != -1
      ? "text-danger font-weight-bold"
      : props.status.indexOf("SUCCESS") != -1
      ? "text-success font-weight-bold"
      : ""
    : "";

  return (
    <div className={classes()} style={{ maxWidth: "50rem" }}>
      <div className="card-header">{props.header}</div>
      <div className="card-body">
        {props.status && (
          <div id="createStatus" className={statusColor}>
            {props.status}
          </div>
        )}
        {props.title && <h5 className="card-title">{props.title}</h5>}
        {props.text && <p className="card-text">{props.text}</p>}
        {props.body}
      </div>
    </div>
  );
}

export { AppProvider, useAppContext };
