import { Card, useAppContext } from "./AppContext";
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AsyncSelect from "react-select/async";
import { serverUrl } from "./firebaseConfig";

function Administer() {
  const {
    loggedInEmail,
    setUserId,
    userEmail,
    setUserEmail,
    setUserBalance,
    setUserHistory,
    setUserRoles,
    users
  } = useAppContext();

  const navigate = useNavigate();

  const [status, setStatus] = useState("");
  const [nextPage, setNextPage]= useState('/Administer');

  useEffect(() => {
    console.log("in useeffect of administer");
    if (!loggedInEmail) {
      navigate("/Login");
    }
   navigate(nextPage); //nextPage variable value changes on click on button (like Deposit, withdraw..) and useeffect is executed to navigate to the new page.
  }, [loggedInEmail, userEmail, nextPage] );

  /**
   * This function validates the userEmail is not empty and calls getSrchResults to search for the userdata selected
   * @returns 
   */
  async function validateAndGetSelectedUserData() {
    if (userEmail != null && userEmail != "") {
      console.log("valid");
      const data = await getSrchResults(userEmail);
      if ( data != null && data.length >= 0)
        setUserFromDBData(data[0]);
      else setStatus('no data found for user');
      return true;
    } else {
      console.log("invalid");
      setStatus(
        "ERROR: User Account must be selected for performing this action"
      );
      return false;
    }
  }

  /**
   * This function makes db call to get user data of the user selected
   * @param {} emailToSearch 
   * @returns 
   */
  async function getSrchResults(emailToSearch) {
    const url = `${serverUrl}/account/searchWithEmail/${emailToSearch}`;
    const response = await fetch(url);
    const srchResUsers = await response.json();
    return srchResUsers;
  }

  /**
   * This takes userdata retrieved from the db and calls setter methods to set values in the context.
   * @param {*} userData 
   */
  function setUserFromDBData(userData) {
    setUserId(userData._id);
    setUserEmail(userData.email);
    setUserBalance(userData.balance);
    setUserHistory(userData.history);
    setUserRoles(userData.roles);
  }

  /**
   * Calls on Pressing View transactions button
   * @returns 
   */
  async function handleAlldata() {
    const isValid = await validateAndGetSelectedUserData();
    
    if (isValid )  
    {
      setNextPage("/AllData");
    }
    else return;
  }

  async function handleDeposit() {
    const isValid = await validateAndGetSelectedUserData(); 
    if (isValid )  
      {
        setNextPage("/Deposit");
      }
      else return;
  }

  async function handleWithdraw() {
    const isValid = await validateAndGetSelectedUserData(); 
    if (isValid )  
      {
        setNextPage("/Withdraw");
      }
      else return;
  }

  async function handleTransfer() {
    const isValid = await validateAndGetSelectedUserData(); 
    if (isValid )  
      {
        setNextPage("/Transfer");
      }
      else return;
  }

 
  /**
   * Calls when user selected is changed.
   */
  function handleAccChange() {
    clearContextFields();
  }

  function clearContextFields() {
    setUserId(null);
    setUserEmail(null);
    setUserBalance(0);
    setUserHistory([]);
    setUserRoles([]);
  }

  const handleChange = (selectedOption) => {
    setUserEmail(selectedOption.value);
  };

  /**
   * Used to load the matching values 
   * @param {*} searchValue 
   * @param {*} callback 
   */
  const loadOptions = async (searchValue, callback) => {
    setStatus('');
    const filteredOptions = users.filter((option) =>
      option.label.toLowerCase().includes(searchValue.toLowerCase())
    );
    callback(filteredOptions);
  };


  return (
    <>
      <Card
        bgcolor=""
        txtcolor="black"
        header="Administer Account"
        title=""
        status={status}
        body={
          <>
            {!userEmail && <h4>Search for the account to be administered</h4>}
            {!userEmail &&<AsyncSelect
                    defaultOptions
                    loadOptions={loadOptions}
                    onChange={handleChange}
                    placeholder="Enter email or name to search"
                  /> }

            {userEmail && (
              <div>
                <h4>You are administering the account for {userEmail}</h4>
                <button onClick={handleAccChange}>
                  Change User Account to Administer
                </button>
              </div>
            )}
             
           
            <Button id="alldata" className="p-2 m-2" onClick={handleAlldata}>
              View Transactions
            </Button>
            <Button id="deposit" className="p-2 m-2" onClick={handleDeposit}>
              Deposit Funds
            </Button>
            <Button id="withdraw" className="p-2 m-2" onClick={handleWithdraw}>
              Withdraw Funds
            </Button>
            <Button id="withdraw" className="p-2 m-2" onClick={handleTransfer}>
              Transfer Funds
            </Button>
          </>
        }
      />
    </>
  );
}

export default Administer;
