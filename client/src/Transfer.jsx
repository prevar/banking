import React, { useEffect, useState } from "react";
import { useAppContext, Card } from "./AppContext";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "./firebaseConfig";
import AsyncSelect from "react-select/async";

function Transfer() {
  const {
    loggedInEmail,
    userEmail,
    userBalance,
    isAdmin,
    users,
    setUserHistory,
  } = useAppContext();

  const [transferAmount, setTransferAmount] = useState(0);
  const [toUserEmail, setToUserEmail] = useState(null);
  const [matchingUsers, setMatchingUsers] = useState(null);
  const [status, setStatus] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedInEmail) {
      navigate("/Login");
    } else {
      if (!userEmail && isAdmin) {
        navigate("/Administer");
      }
    }
  }, [loggedInEmail, userEmail, userBalance]);

  const loadOptions = async (searchValue, callback) => {
    console.log("options are-----" + users);
    const filteredOptions = users.filter((option) =>
      option.label.toLowerCase().includes(searchValue.toLowerCase())
    );
    console.log("loadoptions", searchValue, filteredOptions);
    callback(filteredOptions);
  };

  const handleChange = (selectedOption) => {
    console.log("handlechange", selectedOption);
    setToUserEmail(selectedOption.value);
    console.log("handlechange after", toUserEmail);
  };

  async function transfer() {
    if (validateTransfer()) {
      let userAfterTransfer = await callTransferAmt();
      if (!isAdmin) setUserHistory(userAfterTransfer.history);
      clearFields();
    }
  }

  async function getMatchingUsers(nametosearch) {
    console.log("in getsrchresults");
    let url = "";
    if (nametosearch != null && nametosearch != "") {
      url = `${serverUrl}/account/search/${nametosearch}`;
    }
    const response = await fetch(url);
    const matchingUsers = await response.json();
    return matchingUsers;
  }

  /*async function handleToUserChange(e) {
    console.log(' in handleToUserChange'+e.target.value);
    setToUserEmail(e.target.value);
    const data = await getMatchingUsers(e.target.value);
    setSrchResults((oldData)=>data);
  }*/

  //Needs to be implemented to check if sufficient funds are available etc.
  function validateTransfer() {
    let valid = true;
    let errString = "";
    if (userEmail == null || userEmail == "") {
      valid = false;
      errString =
        "From User has to be specified for the amount to be transfered. ";
    }
    if (toUserEmail == null || toUserEmail == "") {
      valid = false;
      errString +=
        "To User has to be specified for the amount to be transfered. ";
    }
    if (transferAmount <= 0) {
      valid = false;
      errString += "Transfer amount has to be greater than 0. ";
    }
    if (transferAmount > userBalance) {
      valid = false;
      errString +=
        "Transfer amount has to be less than equal to the balance in the senders account.";
    }
    if (!valid) setStatus(`ERROR: ${errString}`);
    return valid;
  }

  async function callTransferAmt() {
    console.log(
      `hhhhhhhhhhhhhh= ${loggedInEmail}/${userEmail}/${toUserEmail}/${transferAmount}`
    );
    let response = await fetch(
      serverUrl +
        `/account/transfer/${loggedInEmail}/${userEmail}/${toUserEmail}/${transferAmount}`
    );
    if (response.status == 200) {
      setStatus("SUCCESS: Amount Transferred successfully");
    } else {
      setStatus(JSON.stringify(response));
    }
    let userAfterTransfer = response.json();
    return userAfterTransfer;
  }

  function clearFields() {
    document.getElementById("transferAmount").value = 0;
  }
  return (
    <>
      <Card
        bgcolor="light"
        txtcolor="black"
        header="Transfer"
        status={status}
        body={
          <>
            <div className="container p-3">
              <div className="row">
                <div className="col">
                  <label>From User</label>
                </div>
                <div className="col">
                  <input
                    type="text"
                    disabled
                    id="fromUser"
                    value={userEmail}
                  ></input>
                </div>
              </div>
              <div className="row" id="toAccount">
                <div className="col">
                  <label>To User</label>
                </div>
                <div className="col">
                  <AsyncSelect
                    defaultOptions
                    loadOptions={loadOptions}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row" id="amt">
                <div className="col">
                  <label>Amount to Transfer</label>
                </div>
                <div className="col">
                  <input
                    type="input"
                    className="form-control"
                    id="transferAmount"
                    placeholder="Transfer Amount"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.currentTarget.value)}
                  />
                  <br />
                </div>
              </div>
            </div>
            <br />
            <button
              type="submit"
              className="btn btn-primary"
              id="submitBtn"
              onClick={transfer}
            >
              Complete Transfer
            </button>
          </>
        }
      />
    </>
  );
}

export default Transfer;
