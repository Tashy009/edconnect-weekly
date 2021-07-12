import React, { useState } from "react";
import Layout from "./shared/Layout";
import { Alert, Button, Form } from "react-bootstrap";
import { useHistory } from "react-router";

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

const BuildForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertText, setAlertText] = useState("");

  let history = useHistory();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // eslint-disable-next-line default-case
    switch (name) {
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let regInfo = {
      email: email,
      password: password,
    };

    asyncfunctionpost("/api/login", regInfo)

      .then(({errorsFromServer, serverData}) => {
        if (errorsFromServer) {
            setShowAlert(true);
            setAlertText("Invalid email/password");
          
        } else {
            document.cookie = `uid=${serverData.data.id}; domain=; path=/ `;
            history.push("/");
          
        }
      })
      .catch((e) => console.log(e));
  };


    
  return (
    <>
      <div class="mx-auto w-50 p-3 mw-70">
        <h1>Login</h1>
        <Form onSubmit={handleSubmit} id="loginForm">
          <Alert
            className="alert alert-danger"
            variant="danger"
            show={showAlert}
          >
            {alertText}
          </Alert>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email"
              value={email}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={handleChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Login
          </Button>
        </Form>
      </div>
    </>
  );
};

const Login = () => {
  return (
    <Layout>
      <BuildForm />
    </Layout>
  );
};

export default Login;
