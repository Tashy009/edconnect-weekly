
import React, {useEffect, useState} from 'react';
import {Navbar, Nav, Form, FormControl, Button} from 'react-bootstrap';
import {useHistory} from 'react-router-dom';

let asyncHandler = async function(url){

  let response = await fetch(url);
  if(response.status !== 200){
      throw new Error("something went wrong!!!");
  }
  let data = await response.json();
  return data;
  

}

const Header = (props) => {

  const [username, setUsername] = useState('');

  useEffect(()=>{

        
    let cookie = document.cookie.split(';').filter(item => item.trim().startsWith("uid"));

    if(cookie.length > 0){

        let cookieValue = cookie[0].trim().split('=')[1];
        if(cookieValue !== ''){
            asyncHandler(`/api/users/${cookieValue}`)
            .then(data => {

                // let greeting = `Hi, ${data.firstname}`;
                setUsername(data.firstname);

            })
        }

    }
    console.log(cookie)

}, []);


    const history = useHistory()

    const logUserOut = (e) => {
        document.cookie = `uid=;path=/;expires=Thu, 01 Jan 1970T00:00:00Z;`;
        history.push('/');

    }

    return (
        <>
            <Navbar bg="primary" variant="dark" style={{ paddingRight: "10px", paddingLeft: "10px" }}>
                <Navbar.Brand href="/">Project Explorer</Navbar.Brand>

                <Navbar style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                <Nav className="">
                    <Form inline style={{ display: "flex", marginRight: "5px" }}>
                    <FormControl type="text" placeholder="Search Projects" style={{ marginRight: "10px" }} />
                    <Button variant="outline-light">Search</Button>
                    </Form>

                    <Nav.Link href="/submit">Submit</Nav.Link>
                </Nav>


                
                    {username ? 
                    
                    <Nav className="mr-auto">
                        <Nav.Link href="/" onClick={logUserOut}>Logout</Nav.Link>
                        <Navbar.Text>Hi, {username}</Navbar.Text>
                    </Nav>
                    
                    :

                        <Nav className="mr-auto">
                            <Nav.Link href="/signup">Sign Up</Nav.Link>
                            <Nav.Link href="/login">Login</Nav.Link>
                        </Nav>
                    }
                
                </Navbar>


            </Navbar>
        </>
    )

}

export default Header;
