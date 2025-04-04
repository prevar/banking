import { useNavigate } from "react-router-dom";
import { useAppContext, Card } from "./AppContext";
import { auth } from "./firebaseConfig";
import { useEffect } from "react";

const Logout = () => {
  console.log("loading logout");

  const {
    setUserEmail,
    setLoggedInEmail,
    setUserBalance,
    setUserHistory,
    setUserRoles,
    setIsAdmin,
  } = useAppContext();
  const navigate = useNavigate();

  auth
    .signOut()
    .then(console.log("setting user to null"))
    .catch((error) => {
      console.log("error while logging out" + error.mesage);
    });

  useEffect(() => {
    resetContextValues();
    navigate("/Login");
  }, []);

  function loginAgain() {
    navigate("/Login");
  }

  function resetContextValues() {
    setUserEmail(null);
    setLoggedInEmail(null);
    setUserBalance(0);
    setUserHistory([]);
    setUserRoles([]);
    //setUsers([]);
    setIsAdmin(false);
  }
  return;
};
export default Logout;
