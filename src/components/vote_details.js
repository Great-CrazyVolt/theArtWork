import React, { Component } from 'react'
import {
  Navigate,
} from "react-router-dom";
import logo from './images/avatar2.png';
import logo_image from './images/logo.png';

import { FontAwesomeIcon, } from '@fortawesome/react-fontawesome';
import { } from '@fortawesome/free-regular-svg-icons';
import { faArrowLeft, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import Modal from "react-bootstrap/Modal";
import close_batch from './images/close_batch.png';
import open_batch from './images/open_batch.png';
import Wallet_Component from './wallet_component';
import Score_Component from './score_component';
import Login_Component from './login_component';
import Connection from '../connection';
import Image_path from '../image_path';
import Chevron from 'react-chevron';
import moment from "moment";
import sponsor from './images/sponsor.png';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { getDAOContract } from '../utils/constants'

class Vote_Details extends Component {
  constructor(props) {
    super(props);

    this.state = {
      test: "home1",
      selectedbtn: 1,
      redirect: 0,
      showmodal1: false,
      showmodal: false,
      sideshow: 'none',
      selected_vote: 1,
      name: '',
      metamaskID: '',
      description: '',
      phone: '',
      job: '',
      status: '',
      image: '',
      batch: 0,
      sponsored: '',
      login: false,
      all_login: false,
      myname: ' ',
      myvote: false,
      selected_vote_value: 'For',
      member_id: 0,
      candidate_id: 0,
      member_check: false,
      sponsored_by_1: '',
      sponsored_by_2: '',
      sponsored_1_check: 'false',
      sponsored_2_check: 'false',
      sponsored_no: 0,
      my_sponsored: false,
      show_record: 'none',
      company_name: '',
      email: '',
      web_link: '',
      postal_address: '',
    };

  }
  componentDidMount = async () => {
    let user = await localStorage.getItem('customer');

    if (user != null) {
      this.setState({
        login: true,

      })
      let parsed = JSON.parse(user);
      let myname = parsed[0].name
      let type = parsed[0].type
      let id = parsed[0].id
      if (type == 'Member') {
        this.setState({
          all_login: true,
          member_check: true
        })

      }
      else {

      }
      this.setState({
        myname: myname,
        member_id: id,

      })
    }
    else {
      this.setState({
        login: false,
        all_login: false,
        member_check: true,
      })
    }
    let selected_job = await localStorage.getItem('selected_job');
    let parsed2 = JSON.parse(selected_job);
    console.log("vvvvvvvvvv2", parsed2);
    let candidate_id = await localStorage.getItem('id');
    console.log("candidate_id", candidate_id);
    if (candidate_id != null) {


      let parsed1 = JSON.parse(candidate_id);
      console.log("vvvvvvvvvv", parsed1);
      this.setState({
        parsed2: parsed2
      })
      if (parsed2 == "DAO Members") {
        this.get_dao_member_by_id(parsed1)
      }
      else {
        this.get_candidate(parsed1)
      }

    }


  }
  get_candidate = async (id) => {


    let api = Connection + 'get_candidate_by_id';


    console.log("pass => ", api)

    await fetch(api, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: `id=${id}&user_id=${this.state.member_id}`,
    })
      .then((response) => response.json())
      .then((response) => {
        console.log("response11", response.response)
        let current_date = response.date
        this.setState({
          current_date: current_date
        })
        let hasRecord = response.response

        let name = hasRecord[0].name
        let metamaskID = hasRecord[0].metamaskID
        let company_name = hasRecord[0].company_name
        let email = hasRecord[0].new_email
        let web_link = hasRecord[0].web_link
        let postal_address = hasRecord[0].postal_address
        let description = hasRecord[0].description
        if (name == null) {
          name = ''
        }
        if (email == null) {
          email = ''
        }
        if (web_link == null) {
          web_link = ''
        }
        if (postal_address == null) {
          postal_address = ''
        }
        if (company_name == null) {
          company_name = ''
        }
        if (description == null) {
          description = ''
        }
        if (name != '') {
          name = name.replace(/"/g, "'")
        }
        if (company_name != '') {
          company_name = company_name.replace(/"/g, "'")
        }
        if (description != '') {
          description = description.replace(/"/g, "'")
        }
        if (postal_address != '') {
          postal_address = postal_address.replace(/"/g, "'")
        }
        if (web_link != '') {
          web_link = web_link.replace(/"/g, "'")
        }





        let total_for = hasRecord[0].total_for
        let total_against = hasRecord[0].total_against
        let all_votes = hasRecord[0].all_votes
        let my_vote = hasRecord[0].my_vote
        let sponsored_by_1 = hasRecord[0].sponsored_by_1
        let sponsored_by_2 = hasRecord[0].sponsored_by_2
        let sponsored_1_check = hasRecord[0].sponsored_1_check
        let sponsored_2_check = hasRecord[0].sponsored_2_check
        if (sponsored_by_1 == this.state.myname && sponsored_1_check == "false") {

          this.setState({
            my_sponsored: true,
            sponsored_no: 1
          })
        }
        if (sponsored_by_2 == this.state.myname && sponsored_2_check == "false") {
          this.setState({
            my_sponsored: true,
            sponsored_no: 2
          })
        }
        let for_vote = 0
        let against_vote = 0
        if (all_votes != 0) {
          for_vote = total_for / all_votes * 100
          for_vote = Math.round(for_vote)
          against_vote = total_against / all_votes * 100
          against_vote = Math.round(against_vote)
        }

        let p_for = for_vote + "%"
        let p_against = against_vote + "%"
        console.log("total_for =>", for_vote)
        console.log("total_against =>", total_against)
        console.log("all_votes =>", all_votes)
        if (my_vote != null) {
          this.setState({
            myvote: true
          })
        }
        if (name == this.state.myname) {

          this.setState({
            myvote: true
          })
        }
        let job = hasRecord[0].job
        let id = hasRecord[0].id

        let status = hasRecord[0].status
        if (status == 'Closed') {
          this.setState({
            myvote: true
          })
        }
        let type = hasRecord[0].type
        let date = hasRecord[0].date

        let start_date = moment(date).format("MMM DD YYYY, h:mm:ss a")
        console.log("start date =>", start_date)
        let pending_time = '';
        let date1 = new Date(date)
        var new_date = date1.setTime(date1.getTime() + 48 * 60 * 60 * 1000);
        var now = moment(current_date); //todays date
        let end_date = moment(new_date).format("MMM DD YYYY, h:mm:ss a")
        var end = moment(new_date); // another date
        var duration = moment.duration(end.diff(now));
        var days = duration.asHours();
        days = Math.floor(days)
        pending_time = days + " hours left"
        let phone = hasRecord[0].phone
        if (phone == null) {
          phone = ''
        }
        phone = phone.replace("/", "+");
        let profile_image = hasRecord[0].profile_image
        let image = '';
        let batch = 0;
        let sponsored = '';

        if (profile_image == null || profile_image == 'null' || profile_image == '') {

        }
        else {
          image = 'http://localhost:8080/images/' + profile_image
        }
        if (type == 'Member') {
          batch = 1

        }
        else if (type == 'Refused') {
          batch = 2

        }
        else {
          batch = 0

        }
        this.setState({
          name: name,
          metamaskID: metamaskID,
          type: type,
          postal_address: postal_address,
          web_link: web_link,
          email: email,
          company_name: company_name,
          job: job,
          description: description,
          status: status,
          end_date: end_date,
          start_date: start_date,
          phone: phone,
          image: image,
          batch: batch,
          against_vote: against_vote,
          for_vote: for_vote,
          p_against: p_against,
          p_for: p_for,

          candidate_id: id,
          pending_time: pending_time,
          sponsored_2_check: sponsored_2_check,
          sponsored_1_check: sponsored_1_check,
          sponsored_by_2: sponsored_by_2,
          sponsored_by_1: sponsored_by_1,
          show_record: 'block'

        })


      })
      .catch((error) => {
        console.error(error);
      });

  }

  get_dao_member_by_id = async (id) => {


    let api = Connection + 'get_dao_member_by_id';


    console.log("pass => ", api)

    await fetch(api, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: `id=${id}&user_id=${this.state.member_id}`,
    })
      .then((response) => response.json())
      .then((response) => {
        console.log("response11", response.response)
        let hasRecord = response.response

        let name = hasRecord[0].name
        let metamaskID = hasRecord[0].metamaskID
        let company_name = hasRecord[0].company_name
        let email = hasRecord[0].new_email
        let web_link = hasRecord[0].web_link
        let postal_address = hasRecord[0].postal_address
        let description = hasRecord[0].description
        if (name == null) {
          name = ''
        }
        if (email == null) {
          email = ''
        }
        if (web_link == null) {
          web_link = ''
        }
        if (postal_address == null) {
          postal_address = ''
        }
        if (company_name == null) {
          company_name = ''
        }
        if (description == null) {
          description = ''
        }
        if (name != '') {
          name = name.replace(/"/g, "'")
        }
        if (company_name != '') {
          company_name = company_name.replace(/"/g, "'")
        }
        if (description != '') {
          description = description.replace(/"/g, "'")
        }
        if (postal_address != '') {
          postal_address = postal_address.replace(/"/g, "'")
        }
        if (web_link != '') {
          web_link = web_link.replace(/"/g, "'")
        }




        let total_for = hasRecord[0].total_for
        let total_against = hasRecord[0].total_against
        let all_votes = hasRecord[0].all_votes
        let my_vote = hasRecord[0].my_vote
        let sponsored_by_1 = hasRecord[0].sponsored_by_1
        let sponsored_by_2 = hasRecord[0].sponsored_by_2
        let sponsored_1_check = hasRecord[0].sponsored_1_check
        let sponsored_2_check = hasRecord[0].sponsored_2_check
        if (sponsored_by_1 == this.state.myname && sponsored_1_check == "false") {

          this.setState({
            my_sponsored: true,
            sponsored_no: 1
          })
        }
        if (sponsored_by_2 == this.state.myname && sponsored_2_check == "false") {
          this.setState({
            my_sponsored: true,
            sponsored_no: 2
          })
        }
        let for_vote = 0
        let against_vote = 0
        if (all_votes != 0) {
          for_vote = total_for / all_votes * 100
          against_vote = total_against / all_votes * 100
        }
        let p_for = for_vote + "%"
        let p_against = against_vote + "%"
        console.log("total_for =>", for_vote)
        console.log("total_against =>", total_against)
        console.log("all_votes =>", all_votes)
        if (my_vote != null) {
          this.setState({
            myvote: true
          })
        }
        if (name == this.state.myname) {

          this.setState({
            myvote: true
          })
        }
        let job = hasRecord[0].job
        let id = hasRecord[0].id

        let status = hasRecord[0].status
        if (status == 'Closed') {
          this.setState({
            myvote: true
          })
        }
        let type = hasRecord[0].type
        let date = hasRecord[0].date

        let start_date = moment(date).format("MMM DD YYYY, h:mm:ss a")
        console.log("start date =>", start_date)
        let pending_time = '';
        let date1 = new Date(date)
        var new_date = date1.setTime(date1.getTime() + 48 * 60 * 60 * 1000);
        var now = moment(new Date()); //todays date
        let end_date = moment(new_date).format("MMM DD YYYY, h:mm:ss a")
        var end = moment(new_date); // another date
        var duration = moment.duration(end.diff(now));
        var days = duration.asHours();
        days = Math.floor(days)
        pending_time = days + " hours left"
        let phone = hasRecord[0].phone
        if (phone == null) {
          phone = ''
        }
        else {
          phone = phone.replace("/", "+");
        }

        let profile_image = hasRecord[0].profile_image
        let image = '';
        let batch = 0;
        let sponsored = '';

        console.log(`vote_details: ${profile_image}`)
        if (profile_image == null || profile_image == 'null' || profile_image == '') {

        }
        else {
          image = 'http://localhost:8080/images/' + profile_image
        }
        if (type == 'Member') {
          batch = 1

        }
        else if (type == 'Refused') {
          batch = 2

        }
        else {
          batch = 0

        }
        this.setState({
          name: name,
          metamaskID: metamaskID,
          postal_address: postal_address,
          web_link: web_link,
          email: email,
          type: type,
          company_name: company_name,
          job: job,
          description: description,
          status: status,
          end_date: end_date,
          start_date: start_date,
          phone: phone,
          image: image,
          batch: batch,
          against_vote: against_vote,
          for_vote: for_vote,
          p_against: p_against,
          p_for: p_for,

          candidate_id: id,
          pending_time: pending_time,
          sponsored_2_check: sponsored_2_check,
          sponsored_1_check: sponsored_1_check,
          sponsored_by_2: sponsored_by_2,
          sponsored_by_1: sponsored_by_1,
          show_record: 'block'

        })


      })
      .catch((error) => {
        console.error(error);
      });

  }

  cost_vote = async () => {

    const DAOContract = getDAOContract()
    await DAOContract.voteToCandidancyProposal(this.state.selected_vote_value, this.state.metamaskID)

    this.setState({ showmodal: false, })

    let api = Connection + 'cost_vote';

    console.log("pass => ", api)

    await fetch(api, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: `candidate_id=${this.state.candidate_id}&member_id=${this.state.member_id}&vote=${this.state.selected_vote_value}`,
    })
      .then((response) => response.json())
      .then((response) => {
        console.log("response11", response.response)
        let hasRecord = response.response

        this.setState({ showmodal1: true, myvote: true })

        setTimeout(() => {

          window.location.reload(false);
        }, 2000);


      })
      .catch((error) => {
        console.error(error);
      });
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
  showmodal() {
    this.setState({
      showmodal: true
    })
  }
  select_vote(value) {
    if (value == "For") {
      this.setState({
        selected_vote: 1,
        selected_vote_value: value
      })
    }
    else {
      this.setState({
        selected_vote: 2,
        selected_vote_value: value
      })
    }
  }
  move_screen(value) {
    if (value == 'votes') {
      this.setState({
        redirect: 1
      })
    }
    else if (value == '1') {
      this.setState({
        redirect: 4
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
      redirect: 1
    })
  }
  sign_sponsored = async () => {

    const DAOContract = getDAOContract()
    await DAOContract.signAsSponsor(this.state.metamaskID)

    this.setState({
      my_sponsored: false,
    })
    if (this.state.sponsored_no == 1) {
      this.setState({
        sponsored_1_check: 'true'
      })
    }
    else {
      this.setState({
        sponsored_2_check: 'true'
      })
    }

    let api = Connection + 'sign_sponsored';


    console.log("pass => ", api)

    await fetch(api, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: `id=${this.state.candidate_id}&no=${this.state.sponsored_no}`,
    })
      .then((response) => response.json())
      .then((response) => {
        console.log("response11", response.response)
        let hasRecord = response.response




      })
      .catch((error) => {
        console.error(error);
      });

  }
  check() {
    if (this.state.sideshow == 'show') {
      this.setState({
        sideshow: ''
      })
    }
    console.log()
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
    if (this.state.redirect == 4) {
      return <Navigate push to={`${process.env.PUBLIC_URL}/`} />;
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
        <div className='' onClick={() => { this.closeside() }}  >
          <Modal show={this.state.showmodal} size="sm" centered transparent={true} animationType='slide' onHide={() => this.setState({ showmodal: false })}>
            {/* <Modal.Header>Hi</Modal.Header> */}
            <Modal.Body style={{ width: '100%', }}>
              <p style={{ fontSize: '12px', color: 'black', textAlign: 'center', fontWeight: 'bold' }}>Are you sure you want to cast this vote?</p>
              <p style={{ fontSize: '12px', color: 'black', textAlign: 'center', fontWeight: 'bold' }}>This action cannot be undone.</p>
              <div className='selectedvote_div'>
                <h5 style={{ color: 'gray', fontWeight: 'bold', textAlign: 'center' }}>{this.state.selected_vote_value}</h5>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <button onClick={() => { this.setState({ showmodal: false }) }} className='btn vote_modal_cancel_btn'>Cancel</button>
              <button onClick={() => { this.cost_vote() }} className='btn vote_modal_vote_btn' style={{}}>Vote</button>

            </Modal.Footer>
          </Modal>

          <Modal className='success_modal' show={this.state.showmodal1} size="sm" centered transparent={true} animationType='slide' onHide={() => this.setState({ showmodal1: false })}>
            {/* <Modal.Header>Hi</Modal.Header> */}
            <Modal.Body style={{ width: '100%', padding: '0px', borderRadius: '30px', backgroundColor: 'red' }}>
              <div className='vote_success'>
                <FontAwesomeIcon style={{ fontSize: '20px', color: 'white', marginRight: '10px', }} icon={faCircleCheck} />
                <h5 style={{ color: 'white', fontWeight: 'bold' }}>Your vote is in!</h5>
              </div>
            </Modal.Body>

          </Modal>

          <header style={{ borderBottom: '1px solid black', height: '60px', display: "flex", alignItems: 'center', }}>
            <div className='d-flex justify-content-between maindiv' style={{ margin: 'auto', alignItems: 'center' }}>
              <div>
                <img style={{ cursor: 'pointer' }} onClick={() => { this.move_screen('1') }} src={logo_image} className="img-fluid logo_img" />

                {/* <h1 style={{cursor:'pointer'}} onClick={()=>{this.move_screen('votes')}} className='header_tittle'>TheArtWorks</h1> */}

              </div>
              <div>
                {this.state.login == true ?
                  <div className='d-flex justify-content-between' style={{ alignItems: 'center' }}>
                    <img src={logo} alt="test" style={{ width: 40, height: 40 }} />
                    <div className="dropdown">
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
                      <div className='bottomborder'></div>
                    </div>
                    {/* <button onClick={()=>{this.move_screen('votes')}} className='header_btn1'>DAO Votes</button> */}
                    <button onClick={() => { this.w3_open(1) }} className='header_btn2'>Join DAO</button>

                  </div>}

              </div>
            </div>
          </header>
          <div className='maindiv' style={{ margin: 'auto', marginTop: '3rem', display: this.state.show_record }}>


            <div className='row mt-3' style={{}}>
              <div className='col-md-8 col-12'>
                <div onClick={() => { this.setState({ redirect: 1 }) }} className='d-flex' style={{ alignItems: 'center', cursor: 'pointer' }}>
                  <FontAwesomeIcon style={{ fontSize: '14px', color: 'gray', marginRight: '10px', marginTop: '2px' }} icon={faArrowLeft} />

                  <h5 style={{ color: 'gray', fontSize: '14px' }}>Back</h5>
                </div>
                <div className='row  detail_page_side1 ' style={{ justifyContent: 'center', marginBottom: '20px', }}>
                  <div className='col-md-3 col-3' style={{ alignItems: 'center' }}>
                    {this.state.image == '' ?
                      <img src={logo} alt="test" className='img-fluid' /> :
                      <LazyLoadImage
                        className='img-fluid candidate_image'
                        effect="blur"
                        placeholderSrc={logo}
                        src={this.state.image} />
                    }
                  </div>
                  <div className='col-md-9 col-9 p-0  d-flex flex-column justify-content-evenly'>

                    <div>
                      <h5 style={{ fontWeight: 'bold' }}>DAO Member  {this.state.parsed2 != 'DAO Members' && <span>candidacy</span>} {this.state.batch == 1 && <img src={open_batch} className="img_fluid" style={{ width: '20px', height: '30px' }} />}
                        {this.state.batch == 2 && <img src={close_batch} className="img_fluid" style={{ width: '20px', height: '30px' }} />}{this.state.batch == 0 && <span>({this.state.pending_time})</span>}</h5>
                    </div>


                    <div className='col-12 d-md-block d-none'>
                      <h5 style={{ marginTop: '10px', fontSize: '16px', fontWeight: 'bold' }}>{this.state.name} - {this.state.job}</h5>
                      <div className='col-md-3 d-md-block d-none '>
                        {this.state.status == 'Active' ? <div className='home_active1' style={{ marginLeft: '0px', marginTop: '20px' }}>
                          <p style={{ textAlign: 'center', color: 'white' }}>Active</p>
                        </div> :
                          <div className='home_closed' style={{ marginLeft: '0px', marginTop: '20px' }}>
                            <p style={{ textAlign: 'center', color: 'white' }}>Closed</p>
                          </div>}
                      </div>

                      <div className='d-flex mt-3' style={{}}>
                        {this.state.sponsored_by_1 == '' || this.state.sponsored_by_1 == null || this.state.sponsored_by_1 == 'null' ?
                          <h5 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '0px', width: '130px', }}>Not Sponsored</h5> :
                          <h5 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '0px', width: '130px', marginTop: '3px' }}>Sponsored By</h5>}
                        <div className='d-flex' style={{ alignItems: 'center', flexWrap: 'wrap' }}>
                          {this.state.sponsored_by_1 == '' || this.state.sponsored_by_1 == null || this.state.sponsored_by_1 == 'null' ? <div></div> : <div className='sponsored_by mb-3'>
                            <h5 style={{ fontSize: '16px', fontWeight: 'bold', }}>{this.state.sponsored_by_1}</h5>
                            {this.state.sponsored_1_check == 'true' ? <FontAwesomeIcon style={{ fontSize: '20px', color: '#21b66e', marginLeft: '10px', }} icon={faCircleCheck} /> : <img src={sponsor} style={{ width: '20px', height: '20px', marginLeft: '10px' }} />}
                            {/* <FontAwesomeIcon style={{fontSize:'20px',color:'#21b66f',marginLeft:'10px'}} icon={faCircleCheck}/> */}
                          </div>}
                          {this.state.sponsored_by_2 == '' || this.state.sponsored_by_2 == null || this.state.sponsored_by_2 == 'null' ? <div></div> : <div className='sponsored_by mb-3'>
                            <h5 style={{ fontSize: '16px', fontWeight: 'bold', }}>{this.state.sponsored_by_2}</h5>
                            {this.state.sponsored_2_check == 'true' ? <FontAwesomeIcon style={{ fontSize: '20px', color: '#21b66e', marginLeft: '10px', }} icon={faCircleCheck} /> : <img src={sponsor} style={{ width: '20px', height: '20px', marginLeft: '10px' }} />}
                            {/* <FontAwesomeIcon style={{fontSize:'20px',color:'#21b66f',marginLeft:'10px'}} icon={faCircleCheck}/> */}
                          </div>}
                        </div>
                      </div>


                    </div>

                  </div>
                  <h5 className='d-md-block d-none' style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '30px', textAlign: 'justify', whiteSpace: 'pre-line', marginBottom: '20px' }}>{this.state.description}</h5>

                  {this.state.phone != '' && <h5 className='d-md-block d-none' style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '30px' }}>Phone : {this.state.phone}</h5>}
                  {this.state.web_link != '' && <h5 style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '0px' }}>{this.state.web_link}</h5>}
                  {this.state.email != '' && <h5 style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '0px' }}>{this.state.email}</h5>}
                  {this.state.company_name != '' && <h5 style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '10px' }}>{this.state.company_name}</h5>}
                  {this.state.postal_address != '' && <h5 style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '0px', whiteSpace: 'pre-line' }}>{this.state.postal_address}</h5>}


                  <div className='col-12 d-md-none d-block'>
                    <div className='row mt-3 mb-2' style={{ alignItems: 'center' }}>

                      <div className='col-8'>
                        <h5 style={{ fontSize: '16px', fontWeight: 'bold' }}>{this.state.name} - {this.state.job}</h5>

                      </div>
                      <div className='col-4'>
                        {this.state.status == 'Active' ? <div className='home_active' >
                          <p style={{ textAlign: 'center', color: 'white' }}>Active</p>
                        </div> :
                          <div className='home_closed' >
                            <p style={{ textAlign: 'center', color: 'white' }}>Closed</p>
                          </div>}
                        {/* <div className='home_active'>
                        <p style={{textAlign:'center',color:'white'}}>Active</p>
                      </div> */}
                      </div>
                    </div>
                    <h5 style={{ fontSize: '16px', fontWeight: 'bold', textAlign: 'justify', whiteSpace: 'pre-line' }}>{this.state.description}</h5>
                    {this.state.phone != '' && <h5 style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '20px' }}>Phone : {this.state.phone}</h5>}
                    {this.state.web_link != '' && <h5 style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '0px' }}>{this.state.web_link}</h5>}
                    {this.state.email != '' && <h5 style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '0px' }}>{this.state.email}</h5>}
                    {this.state.company_name != '' && <h5 style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '10px' }}>{this.state.company_name}</h5>}
                    {this.state.postal_address != '' && <h5 style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '0px', whiteSpace: 'pre-line' }}>{this.state.postal_address}</h5>}


                    <div className=' mt-3' style={{ alignItems: 'center' }}>
                      {this.state.sponsored_by_1 == '' || this.state.sponsored_by_1 == null || this.state.sponsored_by_1 == 'null' ?
                        <h5 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '0px' }}>Not Sponsored</h5> :
                        <h5 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '0px' }}>Sponsored By</h5>}
                      {this.state.sponsored_by_1 == '' || this.state.sponsored_by_1 == null || this.state.sponsored_by_1 == 'null' ? <div></div> : <div className='sponsored_by mt-2'>
                        <h5 style={{ fontSize: '16px', fontWeight: 'bold', }}>{this.state.sponsored_by_1}</h5>
                        {this.state.sponsored_1_check == 'true' ? <FontAwesomeIcon style={{ fontSize: '20px', color: '#21b66e', marginLeft: '10px', }} icon={faCircleCheck} /> : <img src={sponsor} style={{ width: '20px', height: '20px', marginLeft: '10px' }} />}
                        {/* <FontAwesomeIcon style={{fontSize:'20px',color:'#21b66f',marginLeft:'10px'}} icon={faCircleCheck}/> */}
                      </div>}
                      {this.state.sponsored_by_2 == '' || this.state.sponsored_by_2 == null || this.state.sponsored_by_2 == 'null' ? <div></div> : <div className='sponsored_by mt-2'>
                        <h5 style={{ fontSize: '16px', fontWeight: 'bold', }}>{this.state.sponsored_by_2}</h5>
                        {this.state.sponsored_2_check == 'true' ? <FontAwesomeIcon style={{ fontSize: '20px', color: '#21b66e', marginLeft: '10px', }} icon={faCircleCheck} /> : <img src={sponsor} style={{ width: '20px', height: '20px', marginLeft: '10px' }} />}
                        {/* <FontAwesomeIcon style={{fontSize:'20px',color:'#21b66f',marginLeft:'10px'}} icon={faCircleCheck}/> */}
                      </div>}
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-md-1 col-12'></div>
              <div className='col-md-3 col-12'>
                {this.state.myvote == false && this.state.member_check == true && <div className='detail_page_div2' style={{ marginBottom: "20px" }}>
                  <div style={{ borderBottom: "1px solid gray", padding: "10px" }}>
                    <p style={{ fontWeight: 'bold' }}>Cast your vote</p>
                  </div>


                  <div style={{ padding: '5%' }}>
                    <button onClick={() => { this.select_vote('For') }} className={(this.state.selected_vote == 1 ? `active_btn` : `inactive_btn`)}>
                      For
                    </button>
                    <button onClick={() => { this.select_vote('Against') }} className={(this.state.selected_vote == 2 ? `active_btn` : `inactive_btn`)}>
                      Against
                    </button>
                    {this.state.my_sponsored == true && <button onClick={() => { this.sign_sponsored() }} className='sponsorship_btn'>

                      Sign sponsorships
                      <img src={sponsor} style={{ width: '25px', height: '25px', position: 'absolute', right: 10, top: 9 }} />

                    </button>}
                  </div>

                  <div style={{ padding: '5%' }}>
                    {this.state.all_login == false ? <button onClick={() => { this.w3_open(1) }} className='vote_btn'>
                      Vote
                    </button> :
                      <button onClick={() => { this.showmodal() }} className='vote_btn'>
                        Vote
                      </button>}

                  </div>
                </div>}

                <div className='detail_page_div2' style={{ marginBottom: "20px" }}>
                  <div style={{ borderBottom: "1px solid gray", padding: "10px" }}>
                    <p style={{ fontWeight: 'bold' }}>Current Results</p>
                  </div>
                  <div style={{ padding: '5%' }}>
                    <div className='d-flex justify-content-between mb-1'>
                      <p style={{ fontWeight: 'bold', color: '#545353' }}>For</p>
                      <p style={{ fontWeight: 'bold', color: '#545353' }}>{this.state.for_vote}%</p>

                    </div>
                    <div className="progress" >
                      <div className="progress-bar" style={{ width: this.state.p_for }}></div>
                    </div>

                    <div className='d-flex justify-content-between mt-3 mb-1'>
                      <p style={{ fontWeight: 'bold', color: '#545353' }}>Against</p>
                      <p style={{ fontWeight: 'bold', color: '#545353' }}>{this.state.against_vote}%</p>

                    </div>
                    <div className="progress" >
                      <div className="progress-bar" style={{ width: this.state.p_against }}></div>
                    </div>

                    <div className='d-flex justify-content-between mt-4'>
                      <p style={{ fontWeight: 'bold', color: '#545353', fontSize: '14px' }}>Start date</p>
                      <p style={{ fontWeight: 'bold', color: '#545353', fontSize: '14px' }}>{this.state.start_date}</p>

                    </div>
                    <div className='d-flex justify-content-between mt-2'>
                      <p style={{ fontWeight: 'bold', color: '#545353', fontSize: '14px' }}>End date</p>
                      <p style={{ fontWeight: 'bold', color: '#545353', fontSize: '14px' }}>{this.state.end_date}</p>

                    </div>
                  </div>


                </div>
              </div>

            </div>
          </div>

        </div>
      </>
    )
  }
}
export default Vote_Details;