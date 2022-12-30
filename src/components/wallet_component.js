import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Navigate,
  useNavigate,

} from "react-router-dom";

import { getDAOContract, connectToMetaMask } from '../utils/constants'

// import { Redirect } from 'react-router';
import logo from './images/avatar2.png';
import mask from './images/mask.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from "react-bootstrap/Modal";
import Connection from '../connection';
import axios from 'axios';
import { BlockChainContext } from '../context/BlockChainContext';

const { ethereum } = window;

class Wallet_Component extends Component {
  static contextType = BlockChainContext

  constructor(props) {
    super(props);

    this.state = {
      test: "home1",
      showmodal: false,
      sideshow: 'none',
      show_signup_form: false,
      email: '',
      password: '',
      c_password: '',
      valid_email: false,
      valid_password: false,
      valid_c_password: false,
      redirect: false,
      login_password: '',
      login_email: '',
      signup: true,
    };

  }
  async componentDidMount() {
    // try {
    //   if (!ethereum) {
    //     return 'Please install the MetaMask'
    //   }

    //   await ethereum.request({
    //     method: 'eth_requestAccounts'
    //   })

    //   // setCurrentEthAccount(accounts[0])

    // } catch (error) {
    //   console.error(error)
    // }

  }
  async showsignup() {


    const userAddress = await connectToMetaMask()

    // await this.checkValidation(userAddress[0])

    let api = Connection + 'get_candidate_by_metamaskID';
    let result

    await fetch(api, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: `metamaskId=${userAddress}`,
    })
      .then((response) => response.json())
      .then((response) => {
        result = response.response
        console.log("response", result)
      })
    
    
    if (result.length === 0) {
      this.signup(userAddress)
    }
    else {
      this.login(userAddress)
    }

    this.setState({
      show_signup_form: true
    })


    // this.context.connectWallet()
  }

  checkValidation = async (userAddress) => {
    const DAOContract = getDAOContract()
    const isValid = await DAOContract.blacklistedPeople(userAddress)

    // await isValid.wait()

    console.log(isValid)
  }
  // signup()
  // {
  //   this.setState({redirect: true});
  // }
  signup = async (userAddress) => {
    let api = Connection;

    console.log("pass (wallet_component) => ", api)

    await fetch(api, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: `metamaskID=${userAddress}`,
    })
      .then((response) => response.json())
      .then((response) => {
        console.log("response", response.response)

        if (response.response == "email already exist") {
          this.setState({
            valid_c_password: true,
            error_message: 'Email already exists'
          });


        }

        else {

          localStorage.setItem('customer', JSON.stringify(response.response));
          this.setState({
            redirect: 1,
          })


        }


      })
      .catch((error) => {
        console.error(error);
      });
  }

  login = async (userAddress) => {

    let api = Connection + "login";


    console.log("pass => ", api)
    await fetch(api, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: `metamaskID=${userAddress}`,
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
            if (date == null || date == '' || date == 'null') {
              this.setState({

                sideshow: '',
                redirect: 1,
              })
            }
            else {
              window.location.reload(false);
              this.setState({

                sideshow: '',
                redirect: 2,
              })
            }

          }



        }


      })
      .catch((error) => {
        console.error(error);
      });
  }


  render() {
    if (this.state.redirect == 1) {
      return <Navigate push to={`${process.env.PUBLIC_URL}/myprofile`} />;
    }
    if (this.state.redirect == 2) {
      return <Navigate push to={`${process.env.PUBLIC_URL}/daovotes`} />;
    }
    return (

      <div className='' >


        <div className='d-flex' style={{ borderBottom: '1px solid gray', padding: '10px', alignItems: 'center' }}>
          <img src={logo} alt="test" className='img-fluid' style={{ width: '40px', height: '40px' }} />
          <p style={{ fontWeight: 'bold', color: 'black', marginLeft: '10px' }}>My Wallet</p>
        </div>

        <div style={{ padding: '20px' }}>
          <button onClick={() => { this.showsignup() }} className='d-flex wallet_btn1' >
            <img src={mask} alt="test" className='img-fluid' style={{ width: '40px', height: '40px' }} />
            <p style={{ fontWeight: 'bold', color: 'black', marginLeft: '10px' }}>MetaMask</p>
          </button>

          {this.state.show_signup_form == true && <div>
            {this.state.signup == true ? <div>
              <input type="email" placeholder='Email' value={this.state.email} onChange={(value) => { this.setState({ email: value.target.value, error_message: '' }) }} className='input1' />
              {this.state.valid_email == true && <span style={{ fontSize: '10px', color: 'red', marginLeft: '10px', fontWeight: 'bold' }}>{this.state.error_message}</span>}


              <input type="password" placeholder='Password' value={this.state.password} onChange={(value) => { this.setState({ password: value.target.value, error_message: '' }) }} className='input1' />
              {this.state.valid_password == true && <span style={{ fontSize: '10px', color: 'red', marginLeft: '10px', fontWeight: 'bold' }}>{this.state.error_message}</span>}


              <input type="password" placeholder='Confirm Password' value={this.state.c_password} onChange={(value) => { this.setState({ c_password: value.target.value, error_message: '' }) }} className='input1' />
              {this.state.valid_c_password == true && <span style={{ fontSize: '10px', color: 'red', marginLeft: '10px', fontWeight: 'bold' }}>{this.state.error_message}</span>}

              <div className='d-flex justify-conntent-center' style={{ alignItems: 'center' }}>
                <button onClick={() => { this.setState({ signup: false }) }} className='' style={{ backgroundColor: 'white', border: 'none', marginTop: '10px', marginLeft: '10px' }}>
                  <p style={{ fontSize: '14px', fontWeight: 'bold', textAlign: 'center', marginBottom: '0px', color: "gray" }}>Sign in</p>
                </button>


                <button onClick={() => { this.signup() }} className='profile_btn2 ' style={{ marginLeft: 'auto' }}>
                  <p style={{ fontSize: '10px', fontWeight: 'bold', textAlign: 'center', marginBottom: '0px', color: "white" }}>Join now</p>
                </button>
              </div>
            </div> :
              <div>
                <input type="email" placeholder='Email' value={this.state.login_email} onChange={(value) => { this.setState({ login_email: value.target.value, error_message: '' }) }} className='input1' />
                {this.state.valid_email == true && <span style={{ fontSize: '10px', color: 'red', marginLeft: '10px', fontWeight: 'bold' }}>{this.state.error_message}</span>}
                <input type="password" placeholder='Password' value={this.state.login_password} onChange={(value) => { this.setState({ login_password: value.target.value, error_message: '' }) }} className='input1' />
                {this.state.valid_password == true && <span style={{ fontSize: '10px', color: 'red', marginLeft: '10px', fontWeight: 'bold' }}>{this.state.error_message}</span>}

                <div className='d-flex justify-conntent-center' style={{ alignItems: 'center' }}>
                  <button onClick={() => { this.setState({ signup: true }) }} className='' style={{ backgroundColor: 'white', border: 'none', marginTop: '10px', marginLeft: '10px' }}>
                    <p style={{ fontSize: '14px', fontWeight: 'bold', textAlign: 'center', marginBottom: '0px', color: "gray" }}>Create Account</p>
                  </button>
                  <button onClick={() => { this.login() }} className='profile_btn2 ' style={{ marginLeft: 'auto' }}>
                    <p style={{ fontSize: '10px', fontWeight: 'bold', textAlign: 'center', marginBottom: '0px', color: "white" }}>Ok</p>
                  </button>
                </div>
              </div>}
          </div>}
        </div>

      </div>
    )
  }
}
export default Wallet_Component;