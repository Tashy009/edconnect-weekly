// import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './Home';
import Signup from './Signup';
import Login from './Login';
import CreateProject from './CreateProject';
import Project from './Project';

function App() {
  return (
    
      
      <Router>

        <Switch>

          <Route path="/" exact={true} component={Home}/>
          <Route path="/signup" exact={true} component={Signup}/> 
          <Route path="/login" exact={true} component={Login}/>
          <Route path="/submit" exact={true} component={CreateProject}/>
          <Route path="/projects/:id" exact={true} component={Project}/> 
          <Route path="*" render={()=><div><h1>Oga, This link no exist</h1></div>}/>  

        </Switch>

      </Router>

    
  );
}

export default App;