import React, { PropTypes } from 'react';
// import PropTypes from 'react';
import axios from 'axios';
import { Redirect, withRouter, Link } from 'react-router-dom';
import history from './history.js';

class AddPinModal extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      imgTitle: '',
      imgUrl: '',
      submitted: false
    };
  }
  // static propTypes = {
  //   match: PropTypes.object.isRequired,
  //   location: PropTypes.object.isRequired,
  //   history: PropTypes.object.isRequired
  // }
  // static contextTypes = {
  //   router: PropTypes.object
  // }

  submitPin = () => {
    //AJAX to add pin to database
    axios.post('/api/submitpin', {
      imgUrl: this.state.imgUrl, 
      imgTitle: this.state.imgTitle,
      user: this.props.user
    }).then((res) => {
      console.log('added pin');
      history.push('/');
      // this.propTypes.history.push('/');
      // this.setState({
      //   submitted: true
      // });
      // this.context.router.push('/');
      // location.reload() ;
    }).catch((err) => {
      console.log(err);
    })
  }
  handleChange = (e) => {
    let name = e.target.id;
    this.setState({
      [name]: e.target.value
    });
  }
  render(){
    const { match, location, history } = this.props
    if(this.state.submitted){
      console.log('redirecting');
      return (
        <Redirect to='/' />
      )
    }
    else if(this.props.loggedIn){

      return (
        <div id="addPinModal" className="modal fade" role="dialog">
          <div className="modal-dialog">

            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal">&times;</button>
                <h4 className="modal-title">Add New Pinned Image</h4>
              </div>
              <div className="modal-body">
                <p>Image URL:</p>
                <input type='text' id='imgUrl' placeholder='http://website.com/img.jpg' value={this.state.imgUrl} onChange={this.handleChange}/><br/>
                <p>Image Title:</p>
                <input type='text' id='imgTitle' value={this.state.imgTitle} onChange={this.handleChange}/><br />
                <btn className='btn btn-success' onClick={this.submitPin} data-dismiss="modal">Add Pin</btn>
              </div>  
              <div className="modal-footer">
                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
              </div>
            </div>

          </div>
        </div>
      )
    }
    else{
      return (
        <div id="addPinModal" className="modal fade" role="dialog">
          <div className="modal-dialog">

            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal">&times;</button>
                <h4 className="modal-title">Add New Pinned Image</h4>
              </div>
              <div className="modal-body">
                To submit a new pinned image, please <a href='http://127.0.0.1:5000/auth/twitter'>login</a>.
              </div>  
              <div className="modal-footer">
                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
              </div>
            </div>

          </div>
        </div>
      )
    }
  }
}

export default AddPinModal;