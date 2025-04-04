import SrchAccount from "./SrchAccount";
import { Card, useAppContext } from "./AppContext";
import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import { FormCheck } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Administer() {
  const {
    setUserId,
    userEmail,
    setUserEmail,
    setUserBalance,
    setUserHistory,
    setUserRoles,
  } = useAppContext();

  const navigate = useNavigate();

  const [srchResults, setSrchResults] = useState([]);
  const [status, setStatus] = useState("");
  let srchTable = <></>;

  useEffect(() => {
    console.log("in useeffect of administer" + srchResults);
  }, [srchResults, userEmail]);

  function handleAlldata() {
    console.log("in handleAlldata");
    if (validateUserSelected()) navigate("/AllData");
  }

  function handleDeposit() {
    console.log("in handleDeposit");
    if (validateUserSelected()) navigate("/Deposit");
  }

  function handleWithdraw() {
    console.log("in handleWithdrwa");
    if (validateUserSelected()) navigate("/Withdraw");
  }

  function handleTransfer() {
    console.log("in handleTransfer");
    if (validateUserSelected()) navigate("/Transfer");
  }

  function validateUserSelected() {
    if (userEmail != null && userEmail != "") {
      console.log("valid");
      return true;
    } else {
      console.log("invalid");
      setStatus(
        "ERROR: User Account must be selected for performing this action"
      );
      return false;
    }
  }

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
            {!userEmail && (
              <SrchAccount
                srchResults={srchResults}
                setSrchResults={setSrchResults}
              />
            )}
            {userEmail && (
              <div>
                <h4>You are administering the account for {userEmail}</h4>
                <button onClick={handleAccChange}>
                  Change User Account to Administer
                </button>
              </div>
            )}
            <SrchResultsTable srchResults={srchResults} />
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

export function SrchResultsTable(props) {
  const {
    setUserId,
    setUserEmail,
    setUserBalance,
    setUserHistory,
    setUserRoles,
  } = useAppContext();

  const data = props.srchResults;

  useEffect(() => {
    console.log("in useeffect of srchresultstable");
  }, []);

  //Fundtion to set All user values in context from the db returned data
  function setUserFromDBData(userData) {
    console.log("in setuserfromdbdata" + userData);
    setUserId(userData._id);
    setUserEmail(userData.email);
    setUserBalance(userData.balance);
    setUserHistory(userData.history);
    setUserRoles(userData.roles);
  }
  function handleSelectChange(e) {
    const selUserData = data.filter((user) => user._id === e.target.value);
    setUserFromDBData(selUserData[0]);
  }

  if (data.length >= 1) {
    const tableRows = data.map((user) => {
      return (
        <tr key={user._id}>
          <td>
            <FormCheck
              value={user._id}
              type="radio"
              name="selectid"
              onChange={handleSelectChange}
            ></FormCheck>
          </td>
          <td>{user._id}</td>
          <td>{user.name}</td>
          <td>{user.balance}</td>
        </tr>
      );
    });
    return (
      <>
        <Table striped>
          <thead>
            <tr>
              <th></th>
              <th>Account ID</th>
              <th>Name</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>{tableRows}</tbody>
        </Table>
      </>
    );
  }
  return <></>;
}

export default Administer;
