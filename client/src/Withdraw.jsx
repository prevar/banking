import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext, Card } from "./AppContext";
import { serverUrl } from "./firebaseConfig";
import { Table } from "react-bootstrap";

function Withdraw() {
  const {
    loggedInEmail,
    userEmail,
    userId,
    userBalance,
    setUserBalance,
    setUserHistory,
  } = useAppContext();

  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [status, setStatus] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    console.log("CreateAccount: in useEffect: BEGIN");
    if (!loggedInEmail) {
      navigate("/Login");
    }
  }, [loggedInEmail, userEmail, userBalance, withdrawAmount]);

  function onChangeWithdrawAmt(event) {
    setStatus("");
    const withdrawAmt = event.target.value;
    setWithdrawAmount(withdrawAmt);
    if (withdrawAmt.length > 0)
      document.getElementById("submitBtn").disabled = false;
  }

  function validateWithdrawAmt(withdrawAmt) {
    const floatAmt = parseFloat(withdrawAmt);
    if (isNaN(floatAmt)) {
      setStatus("ERROR: Withdraw Amount should be numeric");
      return false;
    }
    if (floatAmt <= 0) {
      setStatus("ERROR: Withdraw Amount should be greater than 0");
      return false;
    }
    if (parseFloat(userBalance) - floatAmt < 0) {
      setStatus(
        "ERROR: Withdraw Amount cannot be greater than the available funds"
      );
      return false;
    }
    return true;
  }

  async function withdraw() {
    setStatus("");
    if (validateWithdrawAmt(withdrawAmount)) {
      const newBalance = parseFloat(userBalance) - parseFloat(withdrawAmount);
      const result = await callWithdrawAmt(-parseFloat(withdrawAmount));
      if (result) {
        setUserBalance(result.balance);
        setUserHistory(result.history);
      }
      setStatus(
        `SUCCESS:$${withdrawAmount} withdrawn successfully in your account!`
      );
    }
    //document.getElementById("withdrawAmount").value = "";
    setWithdrawAmount("");
  }

  async function callWithdrawAmt(withdrawnAmount) {
    let response = await fetch(
      serverUrl +
        `/account/updateBalance/${userEmail}/${withdrawnAmount}/${loggedInEmail}`
    );
    let userAfterWithdraw = await response.json();
    return userAfterWithdraw;
  }

  return (
    <>
      <Card
        bgcolor="light"
        txtcolor="black"
        header="Withdraw"
        status={status}
        className="pt-3"
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
            <input
              type="input"
              className="form-control"
              id="withdrawAmount"
              placeholder="Enter the Withdrawal Amount"
              value={withdrawAmount}
              onChange={onChangeWithdrawAmt}
            />
            <br />
            <button
              type="submit"
              className="btn btn-primary"
              id="submitBtn"
              disabled={withdrawAmount.length < 1}
              onClick={withdraw}
            >
              Withdraw
            </button>
          </>
        }
      />
    </>
  );
}

export default Withdraw;
