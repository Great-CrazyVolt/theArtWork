import React, { Component } from 'react'
import {
  Navigate,

} from "react-router-dom";
import logo from './images/avatar2.png';
import logo_image from './images/logo.png';
import LinesEllipsis from 'react-lines-ellipsis'
import sponsor from './images/sponsor.png';
import close_batch from './images/close_batch.png';
import open_batch from './images/open_batch.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Wallet_Component from './wallet_component';
import Score_Component from './score_component';
import Login_Component from './login_component';
import Connection from '../connection';
import moment from "moment";
import Chevron from 'react-chevron'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { faMagnifyingGlass, faCircleCheck } from '@fortawesome/free-solid-svg-icons';

import { getDAOContract } from '../utils/constants'

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      test: "home1",
      jobshow: 'none',
      sideshow: 'none',
      selected_job: 'Active Votes',
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
      no_record: '',
      activateButton: false,
      status_id: '',
      status_member: [],
      metamaskID: '',
      currentMetamaskId: '',
    };

  }

  isBottom(el) {
    return el.getBoundingClientRect().bottom <= window.innerHeight;
  }


  componentWillUnmount() {

    document.removeEventListener('scroll', this.trackScrolling);
  }

  trackScrolling = () => {
    const wrappedElement = document.getElementById('header');
    // console.log('header bottom reached',wrappedElement);
    if (this.isBottom(wrappedElement)) {
      console.log('header bottom reached');

      document.removeEventListener('scroll', this.trackScrolling);

      // this.get_candidates()
    }
  };
  componentDidMount = async () => {
    document.addEventListener('scroll', this.trackScrolling);
    let user = await localStorage.getItem('customer');

    if (user != null) {
      this.setState({
        login: true
      })
      console.log("aaaaaaaaaaaaa", user);
      let parsed = JSON.parse(user);
      let metamaskID = parsed[0].metamaskID

      this.account_check(metamaskID)
    }
    else {
      this.setState({
        login: false
      })
    }
    // localStorage.removeItem('selected_job');
    localStorage.setItem('selected_job', JSON.stringify(this.state.selected_job));

    let selected_job = localStorage.getItem('selected_job');

    if (selected_job != null) {
      let parsed2 = JSON.parse(selected_job);
      console.log("aaa11111111111111111111111 =>", parsed2)
      this.setState({
        selected_job: parsed2
      })
    }
    this.get_candidates()
    this.get_dao_member()

    // const userAddress = await ethereum.request({ method: 'eth_requestAccounts' })
    
    // this.setState({
    //   currentMetamaskId: userAddress
    // })
  }


  account_check = async (metamaskID) => {

    let api = Connection + "login";


    console.log("pass => ", api)
    await fetch(api, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: `metamaskID=${metamaskID}`,
    })
      .then((response) => response.json())
      .then((response) => {
        console.log("response", response)

        if (response.response == "fail") {



        }

        else {

          let hasRecord = response.response
          let type = hasRecord[0].type
          if (type == "Refused") {
            this.logout()
          }




        }


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
  move_screen(value) {
    if (value == 'votes') {
      window.location.reload(false);
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
    })
  }

  get_candidates = async () => {

    let api = Connection + 'get_all_candidates';


    console.log("pass => ", api)
    await fetch(api, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },

    })
      .then((response) => response.json())
      .then((response) => {
        console.log("response1", response.date)
        let current_date = response.date
        this.setState({
          current_date: current_date
        })
        let hasRecord = response.response
        let active_record = []
        let closed_record = []
        let member_record = []
        let refused_record = []
        let all_record = []

        if (response.response.length != 0) {
          for (let index = 0; index < hasRecord.length; index++) {
            let type = hasRecord[index].type;
            let name = hasRecord[index].name;
            let status = hasRecord[index].status;
            let total_for = hasRecord[index].total_for;
            let total_against = hasRecord[index].total_against;
            let id = hasRecord[index].id;
            let date = hasRecord[index].date;

            let member = ''
            console.log(`total_for: ${total_for} and total_against: ${total_against}`)
            if (total_for > total_against) {
              member = 'Member'
            }
            else {
              member = 'Refused'
            }

            // is in loop have to fix it 
            this.setState({
              status_id: id,
            })
            
            this.setState(previousState => ({
              status_member: [...previousState.status_member, member]
            }))

            if (date != null) {
              let date1 = new Date(date)

              // let test=date1.setMinutes(date1.getMinutes() + 30)
              // var test = date1.setTime(date1.getTime() + 48 * 60 * 60 * 1000);
              var test = date1.setTime(date1.getTime() + 36000);
              var now1 = moment(current_date);
              let enddate = moment(test)
              let startdate = moment(date).format("MMM DD YYYY, h:mm:ss a")
              var duration1 = moment.duration(enddate.diff(now1));
              var days1 = duration1.asHours();
              console.log("aaaaaaaaaaa =>", moment(now1).format("MMM DD YYYY, h:mm:ss a"))
              console.log("aaaaaaaaaaa =>", moment(test).format("MMM DD YYYY, h:mm:ss a"))
              console.log("duration1 =>", Math.floor(days1))

              //           var new_date=date1.setTime(date1.getTime() +48 * 60 * 60 * 1000);
              //           var now = moment(new Date()); //todays date
              // var end = moment(new_date); // another date
              // var duration = moment.duration(end.diff(now));
              // var days = duration.asHours();
              days1 = Math.floor(days1)
              // console.log("aaaaaaaaaaold =>",days)
              // days=48-days;
              // console.log("aaaaaaaaaanew =>",days)
              if (type == "candidate") {
                if (days1 < 1) {
                  // alert("aaaaa")
                  this.setState({
                    activateButton: true
                  })

                  // this.status_change(id, member)
                }
              }
            }

            console.log("name =>", name)
            console.log("type =>", type)
            console.log("status =>", status)
            
            if (status == 'Active') {
              active_record.push(hasRecord[index])
            }
            else {
              closed_record.push(hasRecord[index])
            }
            if (type == 'Member') {
              member_record.push(hasRecord[index])
            }
            if (type == 'Refused') {
              refused_record.push(hasRecord[index])
            }
            all_record.push(hasRecord[index])

          }

          let selected_job = localStorage.getItem('selected_job');
          console.log(`selected job => ${selected_job}`)
          if (selected_job != null) {
            let parsed2 = JSON.parse(selected_job);
            console.log("aaa11111111111111111111111 =>", parsed2)
            this.setState({
              selected_job: parsed2
            })
            if (parsed2 == "All Votes") {
              this.setState({
                all_votes: all_record,
              })
            }
            else if (parsed2 == "Active Votes") {
              this.setState({
                all_votes: active_record,
              })
            }
            else if (parsed2 == "Closed Votes") {
              this.setState({
                all_votes: closed_record,
              })
            }
            else if (parsed2 == 'DAO Members'){
              this.setState({
                all_votes: member_record,
              })
            }
            else if (parsed2 == "Refused Members") {
              this.setState({
                all_votes: refused_record,
              })
            }
            else {

            }
          }
          else {
            this.setState({
              all_votes: active_record,
            })
          }
          this.setState({

            active_record: active_record,
            closed_record: closed_record,
            member_record:member_record,
            refused_record: refused_record,
            old_all_record: all_record,

          })

          setTimeout(() => {
            this.setState({
              no_record: 'No results',
            })
            localStorage.removeItem('selected_job');
          }, 1000);
        }



      })
      .catch((error) => {
        console.error(error);
      });

  }

  get_dao_member = async () => {

    let api = Connection + 'get_dao_member';


    console.log("pass => ", api)
    await fetch(api, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },

    })
      .then((response) => response.json())
      .then((response) => {
        console.log("response1", response)
        let hasRecord = response.response

        let member_record = []



        if (response.response.length != 0) {
          for (let index = 0; index < hasRecord.length; index++) {


            member_record.push(hasRecord[index])


          }
          
          let selected_job = localStorage.getItem('selected_job');
          let parsed2 = JSON.parse(selected_job);

          if (parsed2 == "DAO Members") {

            this.setState({
              all_votes: member_record
            })
          }
          console.log("aaaaaaaaaaaaaaaaaaaaaaa =>", member_record)
          this.setState({
            member_record: member_record,

          })
        }



      })
      .catch((error) => {
        console.error(error);
      });

  }
  status_change = async (member, metamaskID) => {


    let api = Connection + 'status_change';


    console.log("pass => ", api)
    console.log("pass1 => ", this.state.search)

    const DAOContract = getDAOContract()
    await DAOContract.calculateResult(metamaskID)

    console.log(`Metamask: ${metamaskID} member: ${member}`)
    await fetch(api, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: `member=${member}&metamaskID="${metamaskID}"`,
    })
      .then((response) => response.json())
      .then((response) => {
        console.log("response11", response.response)

        this.get_candidates()

      })
      .catch((error) => {
        console.error(error);
      });

  }
  search(value) {
    console.log("aaaaaa =>", value.target.value)
    this.setState({
      search: value.target.value
    })
    setTimeout(() => {
      this.search_candidates()
    }, 500);

  }
  search_candidates = async () => {


    let api = Connection + 'search_votes';


    console.log("pass => ", api)
    console.log("pass1 => ", this.state.search)
    await fetch(api, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: `search=${this.state.search}`,
    })
      .then((response) => response.json())
      .then((response) => {
        console.log("response11", response.response.length)
        let hasRecord = response.response
        let active_record = []
        let closed_record = []
        let member_record = []
        let refused_record = []
        let all_record = []

        if (response.response.length != 0) {
          for (let index = 0; index < hasRecord.length; index++) {
            let type = hasRecord[index].type;
            let status = hasRecord[index].status;
            if (status == 'Active') {
              active_record.push(hasRecord[index])
            }
            else {
              closed_record.push(hasRecord[index])
            }
            if (type == 'Member') {
              member_record.push(hasRecord[index])
            }
            if (type == 'Refused') {
              refused_record.push(hasRecord[index])
            }
            all_record.push(hasRecord[index])

          }
          console.log(`Home: ${JSON.stringify(response.response)}`)
          this.setState({
            all_votes: response.response,
            // active_record:active_record,
            // closed_record:closed_record,
            // member_record:member_record,
            // refused_record:refused_record,
            // old_all_record:all_record
          })
        }
        else {
          this.setState({
            all_votes: response.response
          })
        }



      })
      .catch((error) => {
        console.error(error);
      });

  }
  goto_details_page(id) {

    localStorage.setItem('id', JSON.stringify(id));
    localStorage.setItem('selected_job', JSON.stringify(this.state.selected_job));
    this.setState({
      redirect: 3
    })
  }


  follower_show = () => {
    let table = []

    // let len = this.state.campaignlist.length;
    // let hasRecord = this.state.campaignlist;

    let hasRecord = this.state.all_votes
    //  console.log("hasRecordimages",hasRecord)

    let len = hasRecord.length
    //   console.log("hasRecord[0]len => ",len)
    console.log('line 566')
    console.log(hasRecord)

    if (len != 0) {


      for (let i = 0; i < len; i++) {
        let id = hasRecord[i].id
        let name = hasRecord[i].name
        if (name != null) {
          name = name.replace(/"/g, "'")
        }
        let job = hasRecord[i].job
        if (job == null) {
          job = ''
        }
        let description = hasRecord[i].description


        let status = hasRecord[i].status
        let type = hasRecord[i].type
        let date = hasRecord[i].date
        if (description == null) {
          description = '';
        }
        if (description != '') {
          description = description.replace(/"/g, "'")
        }

        // 👇️ Mon Mar 14 2022 11:25:30
        // var new_date=date1.setTime(date1.getTime() + 48 * 60 * 60 * 1000);
        let pending_time = '';
        if (date != null) {
          let date1 = new Date(date)
          // let test=date1.setMinutes(date1.getMinutes() + 30)
          // var test = date1.setTime(date1.getTime() + 48 * 60 * 60 * 1000);
          var test = date1.setTime(date1.getTime() + 36000);
          var now1 = moment(this.state.current_date);
          let enddate = moment(test)
          let startdate = moment(date).format("MMM DD YYYY, h:mm:ss a")
          var duration1 = moment.duration(enddate.diff(now1));
          var days1 = duration1.asHours();

          // let date1=new Date(date)
          //           var new_date=date1.setTime(date1.getTime() +48 * 60 * 60 * 1000);
          //           var now = moment(new Date()); //todays date
          // var end = moment(new_date); // another date
          // var duration = moment.duration(end.diff(now));
          // var days = duration.asHours();
          days1 = Math.floor(days1)
          pending_time = days1 + " Hours left"
        }
        // if(days<1)
        // {
        //   var minuts = duration.asMinutes();
        //   minuts=Math.floor(minuts)
        //   minuts=60-minuts
        //   pending_time=minuts+" Minutes left"
        // }
        // console.log(days)
        // console.log("hours",days);
        const sponsored_by_1 = hasRecord[i].sponsored_by_1
        let sponsored_by_2 = hasRecord[i].sponsored_by_2
        let sponsored_1_check = hasRecord[i].sponsored_1_check
        let sponsored_2_check = hasRecord[i].sponsored_2_check
        let profile_image = hasRecord[i].profile_image
        console.log(`profile_image: ${profile_image}`)
        let image = '';
        let batch = 0;
        let sponsored = '';
        // if(sponsored_by==null || sponsored_by=='null' || sponsored_by=='')
        // {

        // }
        // else
        // {
        //   sponsored=sponsored_by
        // }
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
        var maxLength = 360;
        var result = description.substring(0, maxLength) + '...';
        // console.log("size => ",image)

        if (date != null) {
          
          table.push(<div>
            {

              < div onClick={() => { this.goto_details_page(id) }} className='row p-3 main_record' style={{ justifyContent: 'center', margin: 'auto', marginBottom: '20px', color: 'initial', textDecoration: 'none', cursor: 'pointer', alignItems: 'center' }}>
            <div className='col-md-2 col-3' style={{ alignItems: 'center' }}>
              {image == '' || image == null ?
                <img src={logo} alt="test" className='img-fluid candidate_image' /> :
                <LazyLoadImage
                  className='img-fluid candidate_image'
                  effect="blur"
                  placeholderSrc={logo}
                  src={image} />
              }
            </div>
            <div className='col-md-10 col-9  d-flex flex-column justify-content-evenly'>
              <div className='row'>
                <div className='col-md-9 col-12'>
                  <h5 style={{ fontWeight: 'bold' }}>DAO Member {this.state.selected_job != 'DAO Members' && <span>candidacy</span>} {batch == 1 && <img src={open_batch} className="img_fluid" style={{ width: '20px', height: '30px' }} />}
                    {batch == 2 && <img src={close_batch} className="img_fluid" style={{ width: '20px', height: '30px' }} />}{batch == 0 && <span>({pending_time})</span>}</h5>
                </div>
                <div className='col-md-3 d-md-block d-none '>
                  {this.state.activateButton === true ? <div className='home_active'>
                    <button onClick={() => this.status_change( this.state.status_member[i], hasRecord[i].metamaskID )} style={{ textAlign: 'center', color: 'black', backgroundColor: 'white', borderColor: 'red', borderRadius: '10px', padding: '10px', fontWeight: 'bold', pointer: 'cursor' }}> Calculate Result </button>

                  </div> :

                    status == "Active" ? <div className='home_active'>
                      <p style={{ textAlign: 'center', color: 'white', }}>{status}</p>
                    </div> :
                      <div className='home_closed'>
                        <p style={{ textAlign: 'center', color: 'white', }}>{status}</p>
                      </div>
                  }
                </div>
              </div>
              <div className='col-12 d-md-block d-none'>
                <h5 style={{ marginTop: '10px', fontSize: '16px', fontWeight: 'bold' }}>{name} - {job}</h5>

                <div  >

                  <h5 style={{ fontSize: '16px' }}><LinesEllipsis
                    text={description}
                    maxLine='3'
                    ellipsis='...'
                    trimRight={false}
                    basedOn='words'
                  /></h5>
                </div>

                <div className='d-flex mt-3' style={{ alignItems: 'center' }}>
                  {sponsored_by_1 == '' || sponsored_by_1 == null || sponsored_by_1 == 'null' ?
                    <h5 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '0px' }}>Not Sponsored</h5> :
                    <h5 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '0px' }}>Sponsored By</h5>}
                  {sponsored_by_1 == '' || sponsored_by_1 == null || sponsored_by_1 == 'null' ? <div></div> : <div className='sponsored_by'>
                    <h5 style={{ fontSize: '16px', fontWeight: 'bold', }}>{sponsored_by_1}</h5>
                    {sponsored_1_check == 'true' ? <FontAwesomeIcon style={{ fontSize: '20px', color: '#21b66e', marginLeft: '10px', }} icon={faCircleCheck} /> : <img src={sponsor} style={{ width: '20px', height: '20px', marginLeft: '10px' }} />}
                    {/* <FontAwesomeIcon style={{fontSize:'20px',color:'#21b66f',marginLeft:'10px'}} icon={faCircleCheck}/> */}
                  </div>}
                  {sponsored_by_2 == '' || sponsored_by_2 == null || sponsored_by_2 == 'null' ? <div></div> : <div className='sponsored_by'>
                    <h5 style={{ fontSize: '16px', fontWeight: 'bold', }}>{sponsored_by_2}</h5>
                    {sponsored_2_check == 'true' ? <FontAwesomeIcon style={{ fontSize: '20px', color: '#21b66e', marginLeft: '10px', }} icon={faCircleCheck} /> : <img src={sponsor} style={{ width: '20px', height: '20px', marginLeft: '10px' }} />}
                    {/* <FontAwesomeIcon style={{fontSize:'20px',color:'#21b66f',marginLeft:'10px'}} icon={faCircleCheck}/> */}
                  </div>}
                </div>


              </div>

            </div>
            <div className='col-12 d-md-none d-block'>
              <div className='row mt-3' style={{ alignItems: 'center', }}>

                <div className='col-9'>
                  <h5 style={{ fontSize: '14px', fontWeight: 'bold' }}>{name} - {job}</h5>

                </div>
                <div className='col-3'>
                  {status == "Active" ? <div className='home_active1'>
                    <p style={{ textAlign: 'center', color: 'white', }}>{status}</p>
                  </div> :
                    <div className='home_closed1'>
                      <p style={{ textAlign: 'center', color: 'white', }}>{status}</p>
                    </div>}
                </div>
              </div>
              <h5 style={{ fontSize: '16px', }}><LinesEllipsis
                text={description}
                maxLine='3'
                ellipsis='...'
                trimRight={false}
                basedOn='words'
              /></h5>
              <div className=' mt-3' style={{ alignItems: 'center' }}>
                {sponsored_by_1 == '' || sponsored_by_1 == null || sponsored_by_1 == 'null' ?
                  <h5 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '0px' }}>Not Sponsored</h5> :
                  <h5 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '0px' }}>Sponsored By</h5>}
                {sponsored_by_1 == '' || sponsored_by_1 == null || sponsored_by_1 == 'null' ? <div></div> : <div className='sponsored_by mt-2'>
                  <h5 style={{ fontSize: '14px', fontWeight: 'bold', }}>{sponsored_by_1}</h5>
                  {sponsored_1_check == 'true' ? <FontAwesomeIcon style={{ fontSize: '20px', color: '#21b66e', marginLeft: '10px', }} icon={faCircleCheck} /> : <img src={sponsor} style={{ width: '20px', height: '20px', marginLeft: '10px' }} />}
                  {/* <FontAwesomeIcon style={{fontSize:'20px',color:'#21b66f',marginLeft:'10px'}} icon={faCircleCheck}/> */}
                </div>}
                {sponsored_by_2 == '' || sponsored_by_2 == null || sponsored_by_2 == 'null' ? <div></div> : <div className='sponsored_by mt-2'>
                  <h5 style={{ fontSize: '14px', fontWeight: 'bold', }}>{sponsored_by_2}</h5>
                  {sponsored_2_check == 'true' ? <FontAwesomeIcon style={{ fontSize: '20px', color: '#21b66e', marginLeft: '10px', }} icon={faCircleCheck} /> : <img src={sponsor} style={{ width: '20px', height: '20px', marginLeft: '10px' }} />}
                  {/* <FontAwesomeIcon style={{fontSize:'20px',color:'#21b66f',marginLeft:'10px'}} icon={faCircleCheck}/> */}
                </div>}
              </div>
            </div>
          </div>

            }
          </div >
          )

      }
    }
    return table
  }
    else {
  let img = []

  img.push(<div  >
    {

      <div>
        <p style={{ textAlign: 'center', fontSize: 22, fontWeight: 'bold', marginTop: '15%' }}>{this.state.no_record}</p>

        {/* <Image source={require('../assets/empty_record.png')} style={styles.img_norecord} /> */}
      </div>
    }</div>)

  return img
}
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
changestatus(value) {
  if (value == "All Votes") {
    this.setState({
      selected_job: 'All Votes', jobshow: 'none', all_votes: this.state.old_all_record
    })
  }
  else if (value == "Active Votes") {
    this.setState({
      selected_job: 'Active Votes', jobshow: 'none', all_votes: this.state.active_record
    })
  }
  else if (value == "Closed Votes") {
    this.setState({
      selected_job: 'Closed Votes', jobshow: 'none', all_votes: this.state.closed_record
    })
  }
  else if (value == "DAO Members") {
    this.setState({
      selected_job: 'DAO Members', jobshow: 'none', all_votes: this.state.member_record
    })
  }
  else {
    this.setState({
      selected_job: 'Refused Members', jobshow: 'none', all_votes: this.state.refused_record
    })
  }

}
render() {

  if (this.state.redirect == 4) {
    return <Navigate push to={`${process.env.PUBLIC_URL}/`} />;
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
      <div id='header'>
        <div class={`w3-sidebar w3-bar-block w3-border-right ${this.state.sideshow}`} id="mySidebar" style={{ zIndex: 2 }}>

          <AppComponent />
        </div>
        <div className='' onClick={() => { this.closeside() }}  >

          <header style={{ borderBottom: '1px solid black', height: '60px', display: "flex", alignItems: 'center', }}>
            <div className='d-flex justify-content-between maindiv' style={{ margin: 'auto', alignItems: 'center' }}>
              <div>
                <img style={{ cursor: 'pointer' }} onClick={() => { this.move_screen('1') }} src={logo_image} className="img-fluid logo_img" />
                {/* <h1 style={{cursor:'pointer'}} className='header_tittle'>TheArtWorks</h1> */}

              </div>
              <div>
                {this.state.login == true ?
                  <div className='d-flex justify-content-between' style={{ alignItems: 'center' }}>
                    <img src={logo} alt="test" style={{ width: 40, height: 40 }} />
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
                      <button className='header_btn1'>DAO Votes</button>
                      <div className='bottomborder'></div>
                    </div>

                    <button onClick={() => { this.w3_open(1) }} className='header_btn2'>Join DAO</button>

                  </div>}

              </div>
            </div>
          </header>

          <div className='maindiv' style={{ margin: 'auto', marginTop: '2rem', }}>
            <div className='row' style={{ alignItems: 'center', marginLeft: '0px', marginRight: '0px' }}>
              <div className='col-md-3 col-6 ps-0'>
                <div className="dropdown dropdown1" style={{ position: 'relative' }}>
                  <button onClick={() => { this.openvotestype() }} className="dropbtn ps-1">{this.state.selected_job}<span style={{ marginLeft: '5px' }}><Chevron direction={'down'} /></span></button>
                  <div className="dropdown-content1" style={{ display: this.state.jobshow, width: '150px' }}>
                    <a style={{ cursor: 'pointer' }} onClick={() => { this.changestatus('All Votes') }}>All Votes</a>
                    <a style={{ cursor: 'pointer' }} onClick={() => { this.changestatus('Active Votes') }}>Active Votes</a>
                    <a style={{ cursor: 'pointer' }} onClick={() => { this.changestatus('Closed Votes') }}>Closed Votes</a>
                    <a style={{ cursor: 'pointer' }} onClick={() => { this.changestatus('DAO Members') }}>DAO Members</a>
                    <a style={{ cursor: 'pointer' }} onClick={() => { this.changestatus('Refused Members') }}>Refused Members</a>

                  </div>

                </div>

              </div>
              <div className='col-md-5 col-0 d-md-block d-none'></div>
              <div className='col-md-4 col-6 pe-0'>
                <div className='d-flex justify-content-end' style={{ position: 'relative' }}>
                  <input type="text" placeholder='' value={this.state.search} onChange={(value) => { this.search(value) }} className='search_input' />
                  <FontAwesomeIcon style={{ fontSize: '16px', color: 'black', position: 'absolute', left: 9, top: 7 }} icon={faMagnifyingGlass} />
                </div>
              </div>
            </div>


            <div >
              {/* ####################### record ########################### */}
              {this.follower_show()}


            </div>
          </div>

        </div>
      </div>
    </>
  )
}
}
export default Home;