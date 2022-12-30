import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  Navigate,
  useNavigate,

} from "react-router-dom";
import logo from './images/avatar2.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from "react-bootstrap/Modal";
import Connection from '../connection';
import mask from './images/mask.png';

import { BlockChainContext } from '../context/BlockChainContext';

class Login_Component extends Component {
  static contextType = BlockChainContext

  constructor(props) {
    super(props);

    this.state = {

      test: "home1",
      showmodal: false,
      sideshow: 'none',
      valid_email: false,
      valid_password: false,
      email: '',
      password: '',
      redirect: 0,
    };

  }
  componentDidMount() {


  }

  signup = async () => {
    console.log(this.context.abc)
    this.setState({
      valid_email: false,
      valid_password: false,

    })
    let email = this.state.email;
    let password = this.state.password;

    if (email == '') {
      this.setState({
        valid_email: true,
        error_message: 'Email is required.',
      })
    }
    else if (password == '') {
      this.setState({
        valid_password: true,
        error_message: 'Password is required.',
      })
    }

    else {
      let api = Connection + "login";


      console.log("pass => ", api)
      await fetch(api, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: `email=${email}&password=${password}`,
      })
        .then((response) => response.json())
        .then((response) => {
          console.log("response", response)

          if (response.response == "fail") {
            this.setState({
              valid_password: true,
              error_message: 'Account does not exist.'
            });


          }

          else {

            let hasRecord = response.response
            let type = hasRecord[0].type
            let date = hasRecord[0].date
            if (type == "Refused") {
              this.setState({
                valid_password: true,
                error_message: 'Your account is blocked'
              });
            }
            else {

              localStorage.setItem('customer', JSON.stringify(response.response));

              alert(date)
              // if(date==null || date=='' || date=='null')
              // {
              //   this.setState({

              //     sideshow:'',
              //     redirect:2,
              //   })
              // }
              // else
              // {
              //   window.location.reload(false);
              //   this.setState({

              //     sideshow:'',
              //     redirect:1,
              //   })
              // }

            }



          }


        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  render() {
    if (this.state.redirect == 1) {
      return <Navigate push to={`${process.env.PUBLIC_URL}/daovotes`} />;
    }
    if (this.state.redirect == 2) {
      return <Navigate push to={`${process.env.PUBLIC_URL}/myprofile`} />;
    }
    return (

      <div className='' >


        <div className='d-flex' style={{ borderBottom: '1px solid gray', padding: '10px', alignItems: 'center' }}>
          <img src={logo} alt="test" className='img-fluid' style={{ width: '40px', height: '40px' }} />
          <p style={{ fontWeight: 'bold', color: 'black', marginLeft: '10px' }}>My Wallet</p>
        </div>

        <div style={{ padding: '20px' }}>
          <button className='d-flex wallet_btn1' >
            <img src={mask} alt="test" className='img-fluid' style={{ width: '40px', height: '40px' }} />
            <p style={{ fontWeight: 'bold', color: 'black', marginLeft: '10px' }}>MetaMask</p>
          </button>
          <div>
            <input type="email" placeholder='Email' value={this.state.email} onChange={(value) => { this.setState({ email: value.target.value, error_message: '' }) }} className='input1' />
            {this.state.valid_email == true && <span style={{ fontSize: '10px', color: 'red', marginLeft: '10px', fontWeight: 'bold' }}>{this.state.error_message}</span>}
            <input type="password" placeholder='Password' value={this.state.password} onChange={(value) => { this.setState({ password: value.target.value, error_message: '' }) }} className='input1' />
            {this.state.valid_password == true && <span style={{ fontSize: '10px', color: 'red', marginLeft: '10px', fontWeight: 'bold' }}>{this.state.error_message}</span>}

            <div className='d-flex justify-conntent-center' style={{ alignItems: 'center' }}>
              <button onClick={() => { this.signup() }} className='' style={{ backgroundColor: 'white', border: 'none', marginTop: '10px', marginLeft: '10px' }}>
                <p style={{ fontSize: '14px', fontWeight: 'bold', textAlign: 'center', marginBottom: '0px', color: "gray" }}>Create Account</p>
              </button>
              <button onClick={() => { this.signup() }} className='profile_btn2 ' style={{ marginLeft: 'auto' }}>
                <p style={{ fontSize: '10px', fontWeight: 'bold', textAlign: 'center', marginBottom: '0px', color: "white" }}>Ok</p>
              </button>
            </div>
          </div>
        </div>

      </div>
    )
  }
}
export default Login_Component;