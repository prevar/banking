import React from "react";
import { useState, useEffect } from "react";
import { auth, serverUrl } from "./firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { useAppContext, Card } from "./AppContext";
import { useNavigate } from "react-router-dom";

import { Button, Container, Form, Row, Col } from "react-bootstrap";

const Login = () => {
  const navigate = useNavigate();

  //get the Context variables
  const {
    loggedInEmail,
    setLoggedInEmail,
    setIsAdmin,
    setUserId,
    setUserEmail,
    setUserBalance,
    setUserHistory,
    setUserRoles,
    users,
    setUsers,
  } = useAppContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (loggedInEmail) {
      console.log("loggedInEmail in useeffect=" + loggedInEmail);
      navigate("/Home");
    } else {
      console.log("User is not logged in");
      navigate("/Login");
    }
    console.log("auth.currentuser=" + auth.currentUser);
  }, [loggedInEmail]);

  /**Function to validate the input fields. If empty, it returns false */
  function validate(field, label) {
    if (!field) {
      setStatus("ERROR: " + label + " cannot be empty!");
      setTimeout(() => setStatus(""), 3000);
      return false;
    }
    return true;
  }

  /**Function to handleLogin button pressed. If fields are valid, it authenticates the user. */
  function handleLogin(e) {
    e.preventDefault();
    setStatus("");
    if (!validate(email, "Email")) return;
    if (!validate(password, "Password")) return;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(
          "Login: User authenticated!!!" + JSON.stringify(userCredential.user)
        );
        setStatus("SUCCESS:User authenticated in Firebase! Redirecting to home page...");
        getUserAccount(userCredential.user);
      })
      .catch((error) => {
        console.log(error.code + ":" + error.mesage);
        setStatus("ERROR: " + error.message);
      });

    //Uncomment the following method to override firebase authentication and comment call to firebase above
    //overrideFirebase();
  }

  function handleGoogleLogin() {
    const googleProvider = new GoogleAuthProvider();

    // Sign in using a popup
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        // Get the Google access token
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;

        // Get signed-in user info
        const user = result.user;
        getUserAccount(user);
      })
      .catch((err) => {
        // Handle Errors here.
        const credential = GoogleAuthProvider.credentialFromError(err);
        console.log(
          "Error in Google login:",
          err.code,
          err.message,
          credential
        );
      });
  }

  //Method used only for testing to override firebase authentication.
  function overrideFirebase() {
    setStatus("SUCCESS:user authenticated!");
    setLoggedInEmail("preeti@gmail.com");
    getUserAccount({ email: "preeti@gmail.com" });
  }

  function setUserFromDBData(userData) {
    setUserId(userData._id);
    setUserEmail(userData.email);
    setUserBalance(userData.balance);
    setUserHistory(userData.history);
    setUserRoles(userData.roles);
    setLoggedInEmail(userData.email);
  }

  /**
   * get user details from the logged in user. 
   * @param {*} user 
   */
  function getUserAccount(user) {
    (async () => {
      const { email } = user;
      try {
        let response = await fetch(serverUrl + `/account/find/${email}`);
        let authenticatedUser = await response.json();
        console.log("response.json:", authenticatedUser);
        if (authenticatedUser) {
          setStatus("SUCCESS: User exists in Banking system");

          //If role is admin, setIsAdmin to true
          if (authenticatedUser[0].roles.includes("ADMIN")) {
            setIsAdmin(true);
            setLoggedInEmail(email);
          } else {
            //else set User properties
            setUserFromDBData(authenticatedUser[0]);
          }
          findAllNonAdminUsers();
         // getAuthId();
        } else {
          setStatus("ERROR: User not found");
          console.log("invalida user");
        }
      } catch (err) {
        console.log("in catch of getuseraccount" + err);
        setStatus("ERROR: No Account found for user in the banking system!"+err);
      }
    })();
  }

 
  async function findAllNonAdminUsers() {
    let response = await fetch(serverUrl + `/account/findAllNonAdmin`);
    let data = await response.json();
    console.log(data);
    const usersList = await data.map((eachUser) => {
      return { value: eachUser.email, label: eachUser.name };
    });
    setUsers(usersList);
  }

  function handleLogout() {
    signOut(auth)
      .then(clearContext())
      .catch((error) => {
        console.log("error while logging out" + error.mesage);
        throw error;
      });
  }

  function clearContext() {
    setLoggedInEmail(null);
    setStatus("SUCCESS: User Logged out successfully!");
  }

  function handleRegister(e) {
    e.preventDefault();
    setStatus("");
    if (!validate(email, "Email")) return;
    if (!validate(password, "Password")) return;
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("Login: User registered succesfully!!!");
        setStatus("SUCCESS:User registered succesfully!");
      })
      .catch((error) => {
        console.log(error.code + ":" + error.mesage);
        setStatus("ERROR:" + error.message);
      });
  }

  return (
    <div className="">
      <h1 className="title mb-3">Welcome to The Amplitude Bank</h1>
      <Card
        bgcolor="light"
        txtcolor="black"
        header="Member Login"
        status={status}
        body={
          <>
            <Container>
              <h1 className="text-center p-3 mb-5">Welcome</h1>
              <Form className="border border-3 m-3 p-3">
                <Row className="pt-5 px-5">
                  <Col>
                    <Form.Group controlId="formEmail">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => {
                          setStatus("");
                          setEmail(e.currentTarget.value);
                        }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="py-3 px-5">
                  <Col>
                    <Form.Group controlId="formPassword">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => {
                          setStatus("");
                          setPassword(e.currentTarget.value);
                        }}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="py-3 px-5 justify-content-center">
                  <Col className="col-4 offset-1">
                    <Button
                      variant="primary"
                      id="login"
                      type="submit"
                      onClick={handleLogin}
                    >
                      Login
                    </Button>
                  </Col>
                  <Col className="col-4">
                    <Button
                      variant="primary"
                      id="googlelogin"
                      type="submit"
                      onClick={handleGoogleLogin}
                    >
                      Google Login
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Container>
          </>
        }
      />
    </div>
  );
};

export default Login;
