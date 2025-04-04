import React, { useEffect, useState } from "react";
import { useAppContext, Card } from "./AppContext";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "./firebaseConfig";
import { Table } from "react-bootstrap";

function Deposit() {
  const {
    loggedInEmail,
    userEmail,
    userId,
    userBalance,
    setUserBalance,
    setUserHistory,
  } = useAppContext();

  const [depositAmount, setDepositAmount] = useState("");
  const [status, setStatus] = useState("");

  const navigate = useNavigate();

  //Redirect to login page if no userEmail. Also reload page if balance or logged in user email changes.
  useEffect(() => {
    if (!loggedInEmail) {
      navigate("/Login");
    }
  }, [loggedInEmail, userEmail, userBalance, depositAmount]);

  function onChangeDepositAmt(event) {
    setStatus("");
    const depAmt = event.target.value;
    setDepositAmount(depAmt);
    if (depAmt.length > 0)
      document.getElementById("submitBtn").disabled = false;
  }

  function validateDepositAmt() {
    const floatAmt = parseFloat(depositAmount);
    if (isNaN(floatAmt)) {
      setStatus("ERROR: Deposit Amount should be numeric");
      return false;
    }
    if (floatAmt <= 0) {
      setStatus("ERROR: Deposit Amount should be greater than 0");
      return false;
    }
    return true;
  }

  async function deposit() {
    setStatus("");
    if (validateDepositAmt(depositAmount)) {
      const newBalance = parseFloat(userBalance) + parseFloat(depositAmount);
      const result = await callDepositAmt(depositAmount);
      if (result) {
        setUserBalance(result.balance);
        setUserHistory(result.history);
      }
      setStatus(
        `SUCCESS:$${depositAmount} deposited successfully in your account!`
      );
    }
    //Clear value of depositAmt f+if its invalid.
    setDepositAmount("");
  }

  async function callDepositAmt(addedAmount) {
    let response = await fetch(
      serverUrl +
        `/account/updateBalance/${userEmail}/${addedAmount}/${loggedInEmail}`
    );
    let userAfterDeposit = await response.json();
    //console.log('callDepositAmt end - userAfterDeposit='+JSON.stringify(userAfterDeposit));
    return userAfterDeposit;
  }

  function onChangeUser() {
    console.log("in onChangeUser");
  }

  return (
    <>
      <Card
        bgcolor="light"
        txtcolor="black"
        header="Deposit"
        status={status}
        body={
          <>
            <Table>
              <tr>
                <td>ACCOUNT HOLDER: ${userEmail}</td>
                <td>ACCOUNT ID: {userId}</td>
              </tr>
              <tr>
                <td>ACCOUNT BALANCE: ${userBalance}</td>
              </tr>
            </Table>
            <br />
            <input
              type="input"
              className="form-control"
              id="depositAmount"
              placeholder="Enter the Deposit Amount"
              value={depositAmount}
              onChange={onChangeDepositAmt}
            />
            <br />
            <button
              type="submit"
              className="btn btn-primary"
              id="submitBtn"
              disabled={depositAmount.length < 1}
              onClick={deposit}
            >
              Deposit
            </button>
          </>
        }
      />
    </>
  );
}

export default Deposit;
