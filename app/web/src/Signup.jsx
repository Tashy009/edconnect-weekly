import React, { useState, useEffect } from "react";
import { Alert, Button, Col, Form } from "react-bootstrap";
import Layout from "./shared/Layout";
import { useHistory } from "react-router-dom";


let asyncHandler = async function(url){

    let response = await fetch(url);
    if(response.status !== 200){
        throw new Error("something went wrong!!!");
    }
    let data = await response.json();
    return data;
    

}

let asyncfunctionpost = async function(url, postData){
    let response = await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
    });
    if(response.status !== 200){
        let errorsFromServer = true;
        let serverData = await response.json();
        return {errorsFromServer, serverData}
    }else{
        let errorsFromServer = false;
        let serverData = await response.json();
        return {errorsFromServer, serverData}
    } 
    
}


const Signup = () => {
  const [programs, setPrograms] = useState([]);
  const [gradYears, setgradYears] = useState([]);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [prog, setProg] = useState("");
  const [matric, setMatric] = useState("");
  const [gyears, setGyears] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertText, setAlertText] = useState([]);

  let history = useHistory();

  useEffect(() => {
    asyncHandler("/api/programs")
      .then((data) => {
        setPrograms(data);
      });

    asyncHandler("/api/graduationYears")
      .then((data) => setgradYears(data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // eslint-disable-next-line default-case
    switch (name) {

      case "firstName":
        setFirstname(value);
        break;

      case "lastName":
        setLastname(value);
        break;

      case "email":
        setEmail(value);
        break;

      case "password":
        setPassword(value);
        break;

      case "program":
        setProg(value);
        break;

      case "matricNumber":
        setMatric(value);
        break;
      case "graduationYear":
        setGyears(value);
        break;
    }
  };

  const handlesubmit = (e) => {
    e.preventDefault();

    let regInfo = {
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: password,
      matricNumber: matric,
      program: prog,
      graduationYear: gyears,
    };

    asyncfunctionpost("/api/register", regInfo)

      .then(({errorsFromServer, serverData}) => {
        if (errorsFromServer) {
            setShowAlert(true);
            setAlertText(serverData.errors);
          
        } else {
            document.cookie = `uid=${serverData.data.id}; domain=; path=/ `;
            history.push("/");
          
        }
      })
      .catch((e) => console.log(e));
  };

  return (
      <Layout>
        <>
            <div className="mx-auto w-50 p-3 mw-70">
                <h1>Signup</h1>
                <Form id="signupForm" onSubmit={handlesubmit}>
                  <Alert
                      className="alert alert-danger"
                      variant="danger"
                      show={showAlert}
                  >
                      {alertText.map((text) => {
                      return (
                          <>
                          {text}
                          <br />
                          </>
                          );
                      })}
                  </Alert>
                  <Form.Row className="d-flex flex-row ">
                      <Form.Group as={Col} controlId="formGridName">
                        <Form.Label>First Name:</Form.Label>
                        <Form.Control
                            type="text"
                            name="firstName"
                            value={firstname}
                            onChange={handleChange}
                        />
                      </Form.Group>
                      <Form.Group as={Col} controlId="formGridName">
                        <Form.Label>Last Name:</Form.Label>
                        <Form.Control
                            type="text"
                            name="lastName"
                            value={lastname}
                            onChange={handleChange}
                        />
                      </Form.Group>
                  </Form.Row>

                <Form.Row className="d-flex flex-row ">
                    <Form.Group as={Col} controlId="formGridEmail">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                          type="email"
                          name="email"
                          value={email}
                          onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridPassword">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                          type="password"
                          name="password"
                          value={password}
                          onChange={handleChange}
                      />
                    </Form.Group>
                </Form.Row>

                <Form.Row className="d-flex flex-row " >
                    <Form.Group as={Col} xs={6} className="mr-3">
                      <Form.Label>Program:</Form.Label>
                      <Form.Control
                          as="select"
                          value={prog}
                          name="program"
                          onChange={handleChange}
                      >
                          <option>Select Option</option>
                          {programs.map((program) => (
                          <option key={program}>{program}</option>
                          ))}
                    </Form.Control>
                  </Form.Group>

                    <Form.Group as={Col}>
                      <Form.Label>Matric Number:</Form.Label>
                      <Form.Control
                          name="matricNumber"
                          value={matric}
                          onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group as={Col}>
                      <Form.Label>Graduation Year:</Form.Label>
                      <Form.Control
                          as="select"
                          name="graduationYear"
                          value={gyears}
                          onChange={handleChange}
                      >
                          <option>Select Option</option>
                          {gradYears.map((year) => (
                          <option key={year}>{year}</option>
                          ))}
                      </Form.Control>
                    </Form.Group>
                </Form.Row>

                <Button variant="primary" type="submit">
                    Sign Up
                </Button>
                </Form>
            </div>
            
        </>
    </Layout>
  );
};


export default Signup;