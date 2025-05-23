import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext, Card } from "./AppContext";
import { Table } from "react-bootstrap";

function AllData() {
  const { loggedInEmail, userEmail, userId, userBalance, userHistory } =
    useAppContext();

  const navigate = useNavigate();

  //If userEmail or history changes, re-render the page
  useEffect(() => {
    //If userEmail doesnt exist, redirect to Login page
    if (!loggedInEmail) {
      navigate("/Login");
    }
  }, [loggedInEmail, userEmail, userHistory]);

  const tableRows = userHistory.map((transaction, index) => {
    return (
      <tr key={index}>
        <td>{index}</td>
        <td>{transaction.operation}</td>
        <td>{transaction.operand}</td>
        <td>{transaction.createdBy}</td>
        <td>
          {transaction.createdDt
            ? new Date(transaction.createdDt).toLocaleString()
            : ""}
        </td>
      </tr>
    );
  });

  return (
    <>
      {userHistory != null && userHistory.length > 0 && (
        <Card
          bgcolor=""
          txtcolor="black"
          header="All Transactions"
          title=""
          body={
            <>
              <Table bordered className="mb-5">
                <thead>
                  <tr>
                    <th>ACCOUNT HOLDER</th>
                    <th>ACCOUNT ID</th>
                    <th>ACCOUNT BALANCE</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                  <td>{userEmail}</td>
                  <td>{userId}</td>
                  <td>${userBalance}</td>
                  </tr>
                </tbody>
              </Table>
              <Table striped bordered >
                <thead >
                  <tr>
                    <th>Transaction No.</th>
                    <th>Transaction Type</th>
                    <th>Transaction Details</th>
                    <th>Performed By</th>
                    <th>Transaction Date</th>
                  </tr>
                </thead>
                <tbody>{tableRows}</tbody>
              </Table>
            </>
          }
        />
      )}
    </>
  );
}

export default AllData;
