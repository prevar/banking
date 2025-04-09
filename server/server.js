const express = require("express");
const app = express();
const admin = require("./admin");
var dal = require("./dal.js");

const cors = require("cors");
const corsOption = {
  origin: ["https://banking-s7lj.onrender.com"],
};

app.use(express.static("public"));
app.use(cors(corsOption));

app.get("/", (req, res) => res.send("navigate to URL/login.html!"));

/**
 * verifyIdToken - used to verify if the token in the header is valid
 * @param {Request} req
 * @param {Response} res
 */
function verifyIdToken(req, res) {
  const idToken = req.headers.authorization;
  console.log("header:", idToken);

  if (!idToken) {
    console.log("in no token in header");
    res.status(401).send("No valid token in header");
    throw new Error("Authorization failed");
  }
  //verify token
  admin
    .auth()
    .verifyIdToken(idToken)
    .then(function (decodedToken) {
      console.log("decodedToken:", decodedToken);
      res.status(200).send("Authentication success!");
    })
    .catch(function (error) {
      console.log("error", error);
      res.status(500).send("Authentication error");
    });
}

/**
 * Find All Users
 */
app.get("/account/findAll", function (req, res) {
  try {
    dal.findAll().then((users) => {
      if (users.length <= 0) {
        res.send({});
      } else {
        console.log("in findAll - Num of user" + users.length);
        res.send(users);
      }
    });
  } catch (err) {
    console.log("error encoutnered in calling find" + err);
    res.status(500).send("Internal server error: " + err);
  }
});

/**
 * Find All Users non admin users
 */
app.get("/account/findAllNonAdmin", function (req, res) {
  console.log("in findAllNonAdmin ins server js");
  try {
    dal.findByRole("USER").then((users) => {
      if (users.length <= 0) {
        res.send({});
      } else {
        console.log("in findAllNonAdmin IN SERVER JS" + users.length);
        res.send(users);
      }
    });
  } catch (err) {
    console.log("error encoutnered in calling findAllNonAdmin" + err);
    res.status(500).send("Internal server error findAllNonAdmin: " + err);
  }
});

/**
 * Find user by email
 */
app.get("/account/find/:email", function (req, res) {
  try {
    // check if account exists
    dal.find(req.params.email).then((user) => {
      // if user exists, return error message
      if (user.length <= 0) {
        console.log("in find - No User with this email exists");
        res.send({});
      } else {
        // else user exists
        console.log("in find - user exists");
        res.send(user);
      }
    });
  } catch (err) {
    console.log("ERROR encoutnered in calling find" + err);
    res.status(500).send("Internal server error: " + err);
  }
});

/**
 *
 */
app.get("/account/search/:name?/:email?", function (req, res) {
  console.log("found server method" + req.params.email);
  try {
    console.log("in search in server js");
    dal.search(req.params.name ?? "", req.params.email ?? "").then((users) => {
      console.log("users len=" + users.length);
      if (users.length <= 0) {
        res.send([]);
      } else {
        res.send(users);
      }
    });
  } catch (err) {
    console.log("error encountered searching for accounts" + err);
  }
});

/**
 *
 */
app.get("/account/searchWithEmail/:email?", function (req, res) {
  console.log("found server method searchWithEmail" + req.params.email);
  try {
    console.log("in searchWithEmail in server js");
    dal.search("", req.params.email ?? "").then((users) => {
      console.log("users len=" + users.length);
      if (users.length <= 0) {
        res.send([]);
      } else {
        res.send(users);
      }
    });
  } catch (err) {
    console.log("error encountered searching for accounts" + err);
  }
});

/**
 * create user account - First check if user email exists . If it does, give error else create.
 */
app.get(
  "/account/create/:name/:email/:uid/:roles/:accType/:loggedinUser",
  function (req, res) {
    let updatedUser = null;
    const createdDt = Date.now();
    console.log("in create api call in server js");
    try {
      //verifyIdToken(req,res)
      //if (res.status == 200) {

      //check if account exists
      dal.find(req.params.email).then((user) => {
        // if user exists, return error message
        if (user.length > 0) {
          console.log("User already exists" + JSON.stringify(user));
          throw new Error("Useer already exists");
        } else {
          // else create user
          const createduser = dal.create(
            req.params.name,
            req.params.email,
            req.params.uid,
            req.params.roles,
            req.params.accType
          );
          if (createduser) {
            const history = {
              operation: "New User created",
              operand: req.params.name,
              createdBy: req.params.loggedinUser,
              createdDt: createdDt,
            };
            updatedUser = dal.updateUserHistory(req.params.email, history);
          }
          res.send(updatedUser);
        }
      });
      //}
    } catch (err) {
      console.log("ERROR - encountered in calling create");
      res.status(500).send("Internal server error: " + err);
    }
  }
);

/**
 * Update the balance of the user with the specified email and then add transaction to history
 */
app.get(
  "/account/updateBalance/:email/:changedAmt/:loggedinUser",
  async function (req, res) {
    try {
      const result = await dal.update(
        req.params.email,
        parseFloat(req.params.changedAmt)
      );
      let depositOrWith =
        parseFloat(req.params.changedAmt) > 0
          ? "Amount Deposited"
          : "Amount Withdrawn";

      const createdDt = Date.now();
      const history = {
        operation: depositOrWith,
        operand: req.params.changedAmt,
        createdBy: req.params.loggedinUser,
        createdDt: createdDt,
      };
      const updatedUser = await dal.updateUserHistory(
        req.params.email,
        history
      );
      res.send(updatedUser);
    } catch (err) {
      console.log("error encoutnered in calling update");
      res.status(500).send("Internal server error" + err);
    }
  }
);

/**
 * Transfer specified amount from specified fromUser to toUser . Also add history transactions to fromUser, toUser and the user who made the transfer.
 */
app.get(
  "/account/transfer/:adminUserEmail/:fromEmail/:toEmail/:changedAmt",
  async function (req, res) {
    const amt = parseFloat(req.params.changedAmt);
    const createdDt = Date.now();
    try {
      //First debit the amount in the fromUsers account and then credit it to the toUser
      const withdrawResult = await dal.update(req.params.fromEmail, -amt);
      const depositResult = await dal.update(req.params.toEmail, amt);

      //Update transaction history of fromUser
      const fromHistory = {
        operation: "Amount Withdrawn",
        operand: -amt,
        createdBy: req.params.adminUserEmail,
        createdDt: createdDt,
      };
      const updatedFromUser = await dal.updateUserHistory(
        req.params.fromEmail,
        fromHistory
      );

      //Update transaction history of toUser
      const toHistory = {
        operation: "Amount deposited",
        operand: amt,
        createdBy: req.params.adminUserEmail,
        createdDt: createdDt,
      };
      const updatedToUser = await dal.updateUserHistory(
        req.params.toEmail,
        toHistory
      );

      res.status(200).send(updatedFromUser);
    } catch (err) {
      console.log("ERROR encoutnered in calling update" + err);
      res.status(500).send("Internal server error" + err);
    }
  }
);

app.listen(8080, () => {
  console.log("Running on port 8080");
});
