import React from 'react';
import './App2.css';
import { BrowserRouter as Router, Route, Link} from 'react-router-dom';
import axios from 'axios';
import Home from './Home';
import MyPins from './MyPins';
import AddPinModal from './AddImage';
import history from './history.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      user: '',
      refresh: false
    };
  }
  getUser = () => {
    axios.get('/api/getuser').then((res) => {
      if(res.data && !this.state.loggedIn){
        this.setState({
          loggedIn: true,
          user: res.data.username
        });
      }
      else if(res.data == null && this.state.loggedIn){
        this.setState({
          loggedIn: false,
          user: ''
        });
      }
    });
  }
  // refreshHome = () => {
  //   this.setState({
  //     refresh: true
  //   });
  // }
  componentWillMount = () => {
    this.getUser();
  }
  componentWillReceiveProps = () => {
    console.log('mytass');
  }
  render() {
    if(this.state.refresh){

    }
    return (
      <Router history={history}>
        <div>
          <div>
            <NavBar loggedIn={this.state.loggedIn}/>
          </div>
          <div className='App'>
            <Route path='/' component={() => (<AddPinModal loggedIn={this.state.loggedIn} user={this.state.user} onSubmit={this.getUser}/>)} />
            <Route exact={true} path='/' component={() => (<Home loggedIn={this.state.loggedIn} user={this.state.user} />)}/>
            <Route path='/mypins' component={() => (<MyPins loggedIn={this.state.loggedIn} user={this.state.user} />)}/>

          </div>
        </div>
      </Router>
    );
  }
}

const NavBar = (props) => {

  return (
    <div className='navbarTop'>
      <ul>
        <Link to='/' className='routerlink' style={{textDecoration: 'none'}}><li className='title'><i><b><span className='logoBlue'>Pin</span>-App</b> <i className='fa fa-thumb-tack logoTack' aria-hidden='true'></i>&nbsp;</i></li></Link>
        <Link to='/mypins' style={{textDecoration: 'none'}}><li className='navBtn'>My Pins <i className='fa fa-image logoTack'></i></li></Link>
        <li className='navBtn' data-toggle='modal' data-target='#addPinModal'>Post New Image <i className='fa fa-camera-retro logoTack'></i></li>
        <Login loggedIn={props.loggedIn} />

      </ul>
    </div>
  )
}

const Login = (props) => {
  if(props.loggedIn){
    return (
      <a href='http://127.0.0.1:5000/logout'><li className='navBtn'>Logout&nbsp;<i className='fa fa-twitter logoTack' aria-hidden='true'></i></li></a>
    );
  }
  else{
    return (
      <a href='http://127.0.0.1:5000/auth/twitter'><li className='navBtn'>Login&nbsp;<i className='fa fa-twitter logoTack' aria-hidden='true'></i></li></a>
    );
  }
}
export default App;
