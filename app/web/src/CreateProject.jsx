import React, { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { useHistory } from "react-router";
import Layout from "./shared/Layout";

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

const CreateProjectForm = () => {
  let history = useHistory();
  let cookie = document.cookie.split(';').filter(item => item.trim().startsWith("uid"));

    if(cookie.length > 0){ // If a cookie still exists 

        let cookieName = cookie[0].trim().split('=')[1];

        if(cookieName === ''){
            history.push("/login");
            
        }
    }else{
        history.push("/login");
    }

    
    

  const [name, setName] = useState("");
  const [abstract, setAbstract] = useState("");
  const [authors, setAuthors] = useState("");
  const [tags, setTags] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertText, setAlertText] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // eslint-disable-next-line default-case
    switch (name) {
      case "name":
        setName(value);
        break;
      case "abstract":
        setAbstract(value);
        break;
      case "authors":
        setAuthors(value);
        break;
      case "tags":
        setTags(value);
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const tagsInput = tags.split(",");
    const authorsInput = authors.split(",");

    let regInfo = {
      name: name,
      abstract: abstract,
      tags: tagsInput,
      authors: authorsInput,
    };

    console.log(regInfo);

    asyncfunctionpost("/api/projects", regInfo)

      .then(({errorsFromServer, serverData}) => {
        if (errorsFromServer) {
            setShowAlert(true);
            setAlertText(serverData.errors);
          
        } else {
            history.push("/");
          
        }
      })
      .catch((e) => console.log(e));
    
  };
  return (
    <>
      <div className="mx-auto w-50 p-3 mw-70">
        <h3>Submit Project</h3>
        <Form onSubmit={handleSubmit} id="createProjectForm">
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
          <Form.Group>
            <Form.Label>Project Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter project name"
              name="name"
              value={name}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Project Abstract</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              name="abstract"
              value={abstract}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Author(s)</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter author names (seperated by comma)"
              name="authors"
              value={authors}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Tag(s)</Form.Label>
            <Form.Control
              type="text"
              placeholder="Use # to seperate projects with different topics (e.g #javascript #mongodb) "
              name="tags"
              value={tags}
              onChange={handleChange}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Continue
          </Button>
        </Form>
      </div>
    </>
  );
};
const CreateProject = () => {
  return (
    <Layout>
      <CreateProjectForm />
    </Layout>
  );
};

export default CreateProject;