import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useNavigate,
  Navigate,
} from "react-router-dom";
import logo from './images/avatar2.png';
import sponsor from './images/sponsor.png';
import logo_image from './images/logo.png';
import close_batch from './images/close_batch.png';
import open_batch from './images/open_batch.png';
import { FontAwesomeIcon, } from '@fortawesome/react-fontawesome';
import { } from '@fortawesome/free-regular-svg-icons';
import { faArrowLeft, faMagnifyingGlass, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import Modal from "react-bootstrap/Modal";
import Wallet_Component from './wallet_component';
import Score_Component from './score_component';
import Login_Component from './login_component';
import Chevron from 'react-chevron'
class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      test: "home1",
      jobshow: 'none',
      sideshow: 'none',
      selected_job: 'All Votes',
      login: false,
      selectedbtn: 1,
      redirect: 0,
      all_votes: [],
      active_record: [],
      closed_record: [],
      member_record: [],
      refused_record: [],
      old_all_record: [],
      search: '',
      profile_image: '',
    };

  }
  componentDidMount = async () => {
    let user = await localStorage.getItem('customer');

    if (user != null) {
      this.setState({
        login: true
      })
      console.log("aaaaaaaaaaaaa", user);
      let parsed = JSON.parse(user);
      let id = parsed[0].id
      let metamaskID = parsed[0].metamaskID
      this.setState({
        profile_image: 'http://localhost:8080/images/' + parsed[0].profile_image
      })

      console.log(this.state.profile_image)
      console.log("aaaaaaaaaaaaa", id);
      console.log("aaaaaaaaaaaaa", metamaskID);

      // this.account_check(email,password)
    }
    else {
      this.setState({
        login: false
      })
    }
  }

  w3_close() {
    console.log("aaaa ->")
    this.setState({
      sideshow: ''
    })
  }

  w3_open(value) {
    this.setState({
      selectedbtn: value
    })
    console.log("aaaa ->")
    if (this.state.sideshow == 'show') {
      this.setState({
        sideshow: ''
      })
    }
    else {
      this.setState({
        sideshow: 'show'
      })
    }

  }

  move_screen(value) {
    if (value == 'votes') {
      this.setState({
        redirect: 1
      })
    }
    else {
      this.setState({
        redirect: 2
      })
    }
  }

  logout() {
    localStorage.removeItem('customer');
    this.setState({
      login: false,
    })
  }

  openvotestype() {
    console.log("helo =>", this.state.jobshow)
    if (this.state.jobshow == 'none') {
      this.setState({
        jobshow: 'block'
      })
    }
    else {
      this.setState({
        jobshow: 'none'
      })
    }
  }
  
  closeside() {

    if (this.state.sideshow == 'show') {
      this.setState({
        sideshow: ''
      })
    }
    else {

    }

  }

  render() {
    if (this.state.redirect == 1) {
      return <Navigate push to={`${process.env.PUBLIC_URL}/daovotes`} />;
    }
    if (this.state.redirect == 2) {
      return <Navigate push to={`${process.env.PUBLIC_URL}/myprofile`} />;
    }
    if (this.state.redirect == 3) {
      return <Navigate push to={`${process.env.PUBLIC_URL}/profile`} />;
    }
    let AppComponent = null;

    // let AppComponent1 = Drawer_Screen;

    if (this.state.selectedbtn == "1") {
      AppComponent = Wallet_Component
    }
    if (this.state.selectedbtn == "2") {
      AppComponent = Score_Component
    }
    if (this.state.selectedbtn == "3") {
      AppComponent = Login_Component
    }
    return (
      <>
        <div class={`w3-sidebar w3-bar-block w3-border-right ${this.state.sideshow}`} id="mySidebar" style={{ zIndex: 2 }}>

          <AppComponent />
        </div>
        <div className='' onClick={() => { this.closeside() }} style={{ height: '100vh' }} >




          <header style={{ borderBottom: '1px solid black', height: '60px', display: "flex", alignItems: 'center', }}>
            <div className='d-flex justify-content-between maindiv' style={{ margin: 'auto', alignItems: 'center' }}>
              <div>
                <img src={logo_image} className="img-fluid logo_img" />
                {/* <h1 style={{cursor:'pointer'}} className='header_tittle'>TheArtWorks</h1> */}

              </div>
              <div>
                {this.state.login == true ?
                  <div className='d-flex justify-content-between' style={{ alignItems: 'center' }}>
                    <img src={this.state.profile_image} alt="test" style={{width: '30px', height: '30px', borderRadius: '20px', marginLeft: '10px', objectFit: 'cover' }} />
                    <div className="dropdown" >
                      <button onClick={() => { this.w3_close() }} className="dropbtn">Account </button>
                      <div className="dropdown-content">
                        <a style={{ cursor: 'pointer' }} onClick={() => { this.w3_open(2) }}>My Wallet</a>
                        <a style={{ cursor: 'pointer' }} onClick={() => { this.move_screen('votes') }}>DAO votes</a>
                        <a style={{ cursor: 'pointer' }} onClick={() => { this.move_screen('profile') }}>My profile</a>
                        <a style={{ cursor: 'pointer' }} onClick={() => { this.logout() }}>Logout</a>
                      </div>
                      <Chevron direction={'down'} />
                      {/* <FontAwesomeIcon style={{fontSize:'20px',color:'black',marginLeft:'0px',}} icon={faCaretDown}/> */}
                    </div>

                  </div> :
                  <div className='d-flex justify-content-between'>
                    <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', marginRight: '20px' }}>
                      <button onClick={() => { this.move_screen('votes') }} className='header_btn1'>DAO Votes</button>
                      {/* <div className='bottomborder'></div> */}
                    </div>
                    {/* <button onClick={()=>{this.move_screen('votes')}} className='header_btn11'>DAO Votes</button> */}
                    <button onClick={() => { this.w3_open(1) }} className='header_btn2'>Join DAO</button>

                  </div>}

              </div>
            </div>
          </header>


        </div>
      </>
    )
  }
}
export default Header;