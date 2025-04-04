import { Col, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { serverUrl } from "./firebaseConfig";
import { useAppContext } from "./AppContext";

function SrchAccount({ srchResults, setSrchResults }) {
  const { users } = useAppContext();
  const [srchEmail, setSrchEmail] = useState("");
  const [srchName, setSrchName] = useState("");

  useEffect(() => {
    console.log("in useeffect");
  }, [srchResults]);

  async function srchAccHolder(e) {
    console.log("in srchaccholder");
    const data = await getSrchResults(srchName, srchEmail);
    setSrchResults(data);
  }

  async function getSrchResults(nametosearch, emailToSearch) {
    console.log("in getsrchresults");
    let url = "";
    if (nametosearch != null && nametosearch != "") {
      url = `${serverUrl}/account/search/${nametosearch}/${emailToSearch}`;
    } else url = `${serverUrl}/account/searchWithEmail/${emailToSearch}`;
    const response = await fetch(url);
    const srchResUsers = await response.json();
    return srchResUsers;
  }

  async function handleSrchNameChange(e) {
    console.log(" in handleSrchNameChange" + e.target.value);
    setSrchName(e.target.value);
    const data = await getSrchResults(e.target.value, srchEmail);
    setSrchResults((oldData) => data);
  }

  async function handleEmailChange(e) {
    console.log(" in handleSrchNameChange" + e.target.value);
    setSrchEmail(e.target.value);
    const data = await getSrchResults(srchName, e.target.value);
    setSrchResults((oldData) => data);
  }

  return (
    <div>
      <Row className="p-2">
        <Col>
          <input
            type="input"
            className="form-control"
            placeholder="Name"
            id="name"
            value={srchName}
            onChange={handleSrchNameChange}
          />
        </Col>
        <Col>
          <input
            type="input"
            className="form-control"
            placeholder="Email"
            id="email"
            value={srchEmail}
            onChange={handleEmailChange}
          />
        </Col>
      </Row>

      <Row className="p-2 ">
        <Col>
          <button id="find" onClick={srchAccHolder}>
            Find account
          </button>
        </Col>
      </Row>
    </div>
  );
}

export default SrchAccount;
