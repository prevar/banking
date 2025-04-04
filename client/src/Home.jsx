import React from "react";
import { useAppContext, Card } from "./AppContext";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Home() {
  const { loggedInEmail, isAdmin } = useAppContext();

  const isAdminMsg = isAdmin
    ? "You have logged in as an Administrator."
    : loggedInEmail
    ? "You are logged in to your account."
    : "Please Login to manage an account ";
  const title = loggedInEmail
    ? `Welcome to the Amplitude bank ${loggedInEmail}`
    : ``;

  const navigate = useNavigate();

  function goToMenuOption(e) {
    const screen = "/" + e.target.id;
    navigate(screen);
  }

  function ShowMenu() {
    let menu = "";
    if (isAdmin) {
      menu = (
        <>
          <div className="d-flex flex-column">
            <Button
              id="CreateAccount"
              className="mb-3"
              onClick={goToMenuOption}
            >
              Create a New Account
            </Button>
            <Button id="Administer" className="mb-3" onClick={goToMenuOption}>
              Administer an account
            </Button>
          </div>
        </>
      );
    } else if (loggedInEmail) {
      menu = (
        <>
          <div className="d-flex flex-column">
            <Button id="AllData" className="mb-3" onClick={goToMenuOption}>
              View Balance and Transactions
            </Button>
            <Button id="Deposit" className="mb-3" onClick={goToMenuOption}>
              Deposit Funds
            </Button>
            <Button id="Withdraw" className="mb-3" onClick={goToMenuOption}>
              Withdraw Funds
            </Button>
            <Button id="Transfer" className="mb-3" onClick={goToMenuOption}>
              Transfer Funds
            </Button>
          </div>
        </>
      );
    }
    return menu;
  }

  return (
    <>
      <h4 className="text-white p-3 m-3">{title}. </h4>
      {
        <div className="d-flex align-items-start">
          <img
            src="bank.jpg"
            className="img-fluid col-6 border border-3 border-white"
            alt="Bank"
          />
          {loggedInEmail && (
            <Card
              bgcolor="light"
              txtcolor="black"
              header={isAdminMsg}
              title=""
              text="What would you like to do today ?"
              body={
                <>
                  <form className="p-2 m-2">
                    <ShowMenu />
                  </form>
                </>
              }
            />
          )}
        </div>
      }
    </>
  );
}

export default Home;
