import React from 'react';
import { useEffect, useState } from 'react';
import Layout from './shared/Layout'; 
import { Container, Card, CardDeck, Button, Jumbotron } from 'react-bootstrap';

let asyncHandler = async function(url){

    let response = await fetch(url);
    if(response.status !== 200){
        throw new Error("something went wrong!!!");
    }
    let data = await response.json();
    return data;
    

}
           
const Home = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {

        asyncHandler('/api/projects')
        .then(data => setProjects(data.slice(0, 4)));
  

    }, [])

        return  (

            <Layout>
                <>

                    <main>
                        <Container>

                            <Jumbotron className="bg-light mb-3 mt-3 d-flex flex-column align-items-start p-3" >
                                
                                    
                                <h1>Welcome to Project Explorer</h1>

                                <p>Project explorer is a repository for final year projects across all departments at your institution. You can submit your project and search projects submitted by others to learn from.</p>
                                
                                <p>
                                    <Button variant="primary" href="/signup">Get Started</Button>{' '}
                                    
                                    <Button variant="secondary" href="/login"> Login </Button>
                                </p>
                                
                    
                            </Jumbotron>

                        </Container>

                        <Container>

                            <CardDeck className="d-flex flex-row justify-content-between mr-3 showcase">
                                {projects.map((project, index) => {
                                    const { abstract, authors, id, name, tags } = project;

                                    return (
                                        <Card key={index} className=" " style={{width: "18rem", marginrRght: "8px"}}>
                                            <Card.Body>
                                                <Card.Title>
                                                    <Card.Link href={`/projects/${id}`}>{name}</Card.Link>
                                                </Card.Title>
                                                <Card.Subtitle className="mb-2 text-muted">
                                                    {authors}
                                                </Card.Subtitle>
                                                <Card.Text>{abstract}</Card.Text>
                                                <Card.Link href="#">{tags}</Card.Link>
                                            </Card.Body>
                                        </Card>
                                    );
                                })}
                            </CardDeck>

                        </Container>

                    </main>
                </>
                

            </Layout>

        );

}


export default Home;