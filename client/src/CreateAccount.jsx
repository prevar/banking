import React, { useState, useEffect } from "react";
import { useAppContext, Card } from "./AppContext";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, serverUrl } from "./firebaseConfig";

function CreateAccount() {
  const { loggedInEmail } = useAppContext();

  const navigate = useNavigate();
  const [show, setShow] = useState(true); //Used to show message after new user account is created and give option of creating another account.
  const [status, setStatus] = useState(""); //Used to show any errors

  useEffect(() => {
    console.log("CreateAccount: in useEffect: BEGIN");
    if (loggedInEmail) {
      console.log("CreateAccount: in useEffect: in if authenticated");
    } else {
      navigate("/Login");
    }
  }, [loggedInEmail]);

  return (
    <Card
      bgcolor=""
      txtcolor="black"
      header="Create Account"
      status={status}
      body={
        show ? (
          <CreateForm
            setShow={setShow}
            setStatus={setStatus}
            loggedInEmail={loggedInEmail}
          />
        ) : (
          <CreateMsg setShow={setShow} />
        )
      }
    />
  );
}

function CreateMsg(props) {
  return (
    <>
      <h5>Success</h5>
      <button
        type="submit"
        className="btn btn-light"
        onClick={() => props.setShow(true)}
      >
        Add another account
      </button>
    </>
  );
}

function CreateForm(props) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [role, setRole] = useState([]);
  const [accountType, setAccountType] = useState("CHECKING");

  function validate(field, label) {
    console.log("in validate");
    if (!field) {
      props.setStatus("ERROR: " + label + " cannot be empty!");
      setTimeout(() => props.setStatus(""), 3000);
      return false;
    } else if (label === "Password" && field.length < 8) {
      props.setStatus("ERROR: Password has to be atleast 8 characters");
      setTimeout(() => props.setStatus(""), 3000);

      return false;
    }
    return true;
  }

  function handleRoleChange(e) {
    console.log("option===" + e.target.options[e.target.selectedIndex].id);
    setRole(e.target.options[e.target.selectedIndex].id);
  }

  function handleAccTypeChange(e) {
    setAccountType(e.target.options[e.target.selectedIndex].id);
  }

  function handle() {
    console.log(name, email, password);
    if (!validate(name, "Name")) return;
    if (!validate(email, "Email")) return;
    if (!validate(password, "Password")) return;
    const selectedRole =
      document.getElementById("role").options[
        document.getElementById("role").selectedIndex
      ].value;
    const roles = [selectedRole];
    console.log("roles=" + roles);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential.user.uid);
        const url =
          serverUrl +
          `/account/create/${name}/${email}/${userCredential.user.uid}/${roles}/${accountType}/${props.loggedInEmail}/`;
        (async () => {
          var res = await fetch(url);
          var data = await res.json();
          console.log(data);
        })();
        console.log("Login: User created succesfully!!!");
        
        props.setStatus("SUCCESS:User created succesfully!");
      })
      .catch((error) => {
        console.log(error.code + ":" + error.mesage);
        props.setStatus("ERROR:" + error.message);
      });

    props.setShow(false);
  }

  return (
    <>
      Name
      <br />
      <input
        type="input"
        className="form-control"
        placeholder="Enter name"
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
      />
      <br />
      Email address
      <br />
      <input
        type="input"
        className="form-control"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.currentTarget.value)}
      />
      <br />
      Password
      <br />
      <input
        type="password"
        className="form-control"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.currentTarget.value)}
      />
      <br />
      Role
      <select
        id="role"
        className="form-select"
        defaultValue="USER"
        onChange={handleRoleChange}
      >
        <option key="USER" id="USER">
          USER
        </option>
        <option key="ADMIN" id="ADMIN">
          ADMIN
        </option>
      </select>
      <br />
      Account Type
      <select
        id="accType"
        className="form-select"
        defaultValue="CHECKING"
        onChange={handleAccTypeChange}
      >
        <option key="CHECKING" id="CHECKING">
          CHECKING
        </option>
        <option key="SAVINGS" id="SAVINGS">
          SAVINGS
        </option>
      </select>
      <br />
      <button type="submit" className="btn btn-primary" onClick={handle}>
        Create Account
      </button>
    </>
  );
}

export default CreateAccount;
