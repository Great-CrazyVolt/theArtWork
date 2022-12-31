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
import sponsor from './images/sponsor.png';
import logo_image from './images/logo.png';
import delete_icon from './images/delete_icon.png';
import LinesEllipsis from 'react-lines-ellipsis'
import open_batch from './images/open_batch.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import Modal from "react-bootstrap/Modal";
import Wallet_Component from './wallet_component';
import Score_Component from './score_component';
import Login_Component from './login_component';
import Connection from '../connection';
import axios from 'axios';
import moment from "moment";
import Image_path from '../image_path';
import Chevron from 'react-chevron'

import { getDAOContract } from '../utils/constants'

// import multer from 'multer';
// const path = require('path')


// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, './images')
//   },
//   filename: (req, file, cb) => {
//     // console.log("file=>",file)
//     cb(null, Date.now() + path.basename(file.originalname))
//   }
// })

const items = [
  {
    id: 0,
    name: 'Cobol'
  },
  {
    id: 1,
    name: 'JavaScript'
  },
  {
    id: 2,
    name: 'Basic'
  },
  {
    id: 3,
    name: 'PHP'
  },
  {
    id: 4,
    name: 'Java'
  }
]
class Profile extends Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.state = {
      test: "home1",
      sideshow: 'none',
      jobshow: 'none',
      selected_job: 'Your Job',
      show_selected_job: 'Your Job',
      showmodal: false,
      showmodal1: false,
      show_sponsor_name: false,
      show_sponsor_name1: false,
      placeholder_show: 'none',
      sponsor_name: '',
      sponsor_id: 0,
      sponsor_name1: '',
      sponsor_id1: 0,
      image_url: null,
      login: false,
      selectedbtn: 1,
      redirect: 0,
      all_members: [],
      otherjob: false,
      profile_image_name: '',
      description: '',
      filesize_error: '',
      login_email: '',

    };

  }
  componentDidMount = async () => {
    localStorage.setItem('selected_job', JSON.stringify('Active Votes'));
    this.get_members()
    let user = await localStorage.getItem('customer');
    console.log('user' , user)
    if (user != null) {
      this.setState({
        login: true
      })
      
      let parsed = JSON.parse(user);
      // parsed = parsed.response
      console.log("aaaaaaaaaaaaa", parsed[0]);
      let id = parsed[0].id
      let name = parsed[0].name
      let metamaskID = parsed[0].metamaskID

      if (name == null) {
        name = '';
      }
      if (name != '') {
        name = name.replace(/"/g, "'")
      }
      let company_name = parsed[0].company_name
      if (company_name == null) {
        company_name = '';
      }
      if (company_name != '') {
        company_name = company_name.replace(/"/g, "'")
      }
      let email = parsed[0].new_email
      let login_email = parsed[0].new_email
      if (email == null || email == 'null' || email == '') {
        email = '';
      }
      let date = parsed[0].date
      let description = parsed[0].description

      if (description == null) {
        description = '';
      }
      if (description != '') {
        description = description.replace(/"/g, "'")
      }
      let type = parsed[0].type
      let job = parsed[0].job
      let phone = parsed[0].phone
      // phone.replace("/", "+");

      let postal_address = parsed[0].postal_address
      if (postal_address != null) {
        postal_address = postal_address.replace(/"/g, "'")
      }
      console.log("long =>", postal_address)
      if (postal_address == '' || postal_address == 'null' || postal_address == null) {
        this.setState({
          placeholder_show: 'block'
        })
      }
      let profile_image = parsed[0].profile_image
      let sponsored_by_1 = parsed[0].sponsored_by_1
      let sponsored_by_2 = parsed[0].sponsored_by_2
      let sponsored_1_check = parsed[0].sponsored_1_check
      let sponsored_2_check = parsed[0].sponsored_2_check
      if (sponsored_by_1 == '' || sponsored_by_1 == null || sponsored_by_1 == "null") {

      }
      else {
        this.setState({
          show_sponsor_name: true,
          sponsor_name: sponsored_by_1
        })
      }
      if (sponsored_by_2 == '' || sponsored_by_2 == null || sponsored_by_2 == "null") {

      }
      else {
        this.setState({
          show_sponsor_name1: true,
          sponsor_name1: sponsored_by_2
        })
      }
      let status = parsed[0].status
      let web_link = parsed[0].web_link
      if (web_link != null) {
        web_link = web_link.replace(/"/g, "'")
      }
      if (profile_image == null || profile_image == "null" || profile_image == "") {

      }
      else {
        this.setState({
          profile_image_name: profile_image,
          image_url: Image_path + profile_image
        })
      }
      if (job == null || job == 'null' || job == '') {

      }
      else {
        this.setState({
          selected_job: job,
          otherjob: true,

        })
      }
      if (type == 'Member') {
        this.get_candidate1(metamaskID)
      }
      else {
        this.get_candidate(id)
      }

      // this.get_candidate1(name)
      this.setState({
        id: id,
        type: type,
        login_email: login_email,
        name: name,
        company_name: company_name,
        email: email,
        date: date,
        description: description,
        status: status,
        phone: phone,
        postal_address: postal_address,
        web_link: web_link,
        sponsored_1_check: sponsored_1_check,
        sponsored_2_check: sponsored_2_check
      })


      console.log("address =>", this.state)


    }
    else {
      this.setState({
        login: false
      })
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
      body: `id=${id}&user_id=${id}`,
    })
      .then((response) => response.json())
      .then((response) => {
        console.log("response11", response.response)
        let parsed = response.response

        let id = parsed[0].id
        let metamaskID = parsed[0].metamaskID
        let name = parsed[0].name
        if (name == null) {
          name = '';
        }
        if (name != '') {
          name = name.replace(/"/g, "'")
        }
        let company_name = parsed[0].company_name
        if (company_name == null) {
          company_name = '';
        }
        if (company_name != '') {
          company_name = company_name.replace(/"/g, "'")
        }
        let email = parsed[0].new_email
        if (email == null || email == 'null' || email == '') {
          email = '';
        }
        let date = parsed[0].date
        let description = parsed[0].description
        if (description == null) {
          description = '';
        }
        if (description != '') {
          description = description.replace(/"/g, "'")
        }
        let type = parsed[0].type
        if (type == 'Member') {
          this.get_candidate1(metamaskID)
        }
        let job = parsed[0].job
        if (job == null) {
          job = '';
        }
        let phone = parsed[0].phone
        if (phone == null) {
          phone = '';
        }
        else {
          phone = phone.replace("/", "+");
        }

        let postal_address = parsed[0].postal_address
        if (postal_address == null) {
          postal_address = '';
        }
        if (postal_address != '') {
          postal_address = postal_address.replace(/"/g, "'")
        }
        if (postal_address == '' || postal_address == 'null' || postal_address == null) {
          this.setState({
            placeholder_show: 'block'
          })
        }
        let profile_image = parsed[0].profile_image
        let sponsored_by_1 = parsed[0].sponsored_by_1
        let sponsored_by_2 = parsed[0].sponsored_by_2
        let sponsored_1_check = parsed[0].sponsored_1_check
        let sponsored_2_check = parsed[0].sponsored_2_check
        if (sponsored_by_1 == '' || sponsored_by_1 == null || sponsored_by_1 == "null") {

        }
        else {
          this.setState({
            show_sponsor_name: true,
            sponsor_name: sponsored_by_1
          })
        }
        if (sponsored_by_2 == '' || sponsored_by_2 == null || sponsored_by_2 == "null") {

        }
        else {
          this.setState({
            show_sponsor_name1: true,
            sponsor_name1: sponsored_by_2
          })
        }
        let status = parsed[0].status
        let web_link = parsed[0].web_link
        if (web_link == null) {
          web_link = '';
        }
        if (web_link != '') {
          web_link = web_link.replace(/"/g, "'")
        }
        if (profile_image == null || profile_image == "null" || profile_image == "") {

        }
        else {
          this.setState({
            profile_image_name: profile_image,
            image_url: Image_path + profile_image
          })
        }
        if (job == null || job == 'null' || job == '') {

        }
        else {
          this.setState({
            selected_job: job,
            otherjob: true,

          })
        }
        this.setState({
          type: type,
          id: id,
          name: name,
          company_name: company_name,
          email: email,
          date: date,
          description: description,
          status: status,
          phone: phone,
          postal_address: postal_address,
          web_link: web_link,
          sponsored_1_check: sponsored_1_check,
          sponsored_2_check: sponsored_2_check
        })



      })
      .catch((error) => {
        console.error(error);
      });

  }

  get_candidate1 = async (metamaskID) => {


    let api = Connection + 'get_candidate_by_id_111';


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
        console.log("response11", response.response)
        let parsed = response.response

        let id = parsed[0].id

        let name = parsed[0].name
        if (name == null) {
          name = '';
        }
        if (name != '') {
          name = name.replace(/"/g, "'")
        }
        let company_name = parsed[0].company_name
        if (company_name == null) {
          company_name = '';
        }
        if (company_name != '') {
          company_name = company_name.replace(/"/g, "'")
        }
        let email = parsed[0].new_email
        if (email == null || email == 'null' || email == '') {
          email = '';
        }
        let date = parsed[0].date
        let description = parsed[0].description
        if (description == null) {
          description = '';
        }
        if (description != '') {
          description = description.replace(/"/g, "'")
        }
        let type = parsed[0].type
        let job = parsed[0].job
        if (job == null) {
          job = '';
        }
        let phone = parsed[0].phone
        if (phone == null) {
          phone = '';
        }
        else {
          phone = phone.replace("/", "+");
        }


        let postal_address = parsed[0].postal_address
        if (postal_address == null) {
          postal_address = '';
        }
        if (postal_address != '') {
          postal_address = postal_address.replace(/"/g, "'")
        }
        if (postal_address == '' || postal_address == 'null' || postal_address == null) {
          this.setState({
            placeholder_show: 'block'
          })
        }
        let profile_image = parsed[0].profile_image
        let sponsored_by_1 = parsed[0].sponsored_by_1
        let sponsored_by_2 = parsed[0].sponsored_by_2
        let sponsored_1_check = parsed[0].sponsored_1_check
        let sponsored_2_check = parsed[0].sponsored_2_check
        if (sponsored_by_1 == '' || sponsored_by_1 == null || sponsored_by_1 == "null") {

        }
        else {
          this.setState({
            show_sponsor_name: true,
            sponsor_name: sponsored_by_1
          })
        }
        if (sponsored_by_2 == '' || sponsored_by_2 == null || sponsored_by_2 == "null") {

        }
        else {
          this.setState({
            show_sponsor_name1: true,
            sponsor_name1: sponsored_by_2
          })
        }
        let status = parsed[0].status
        let web_link = parsed[0].web_link
        if (web_link == null) {
          web_link = '';
        }
        if (web_link != '') {
          web_link = web_link.replace(/"/g, "'")
        }
        if (profile_image == null || profile_image == "null" || profile_image == "") {

        }
        else {
          this.setState({
            profile_image_name: profile_image,
            image_url: 'http://192.168.80.130/images/' + profile_image
          })
        }
        if (job == null || job == 'null' || job == '') {

        }
        else {
          this.setState({
            selected_job: job,
            otherjob: true,

          })
        }
        this.setState({
          type: type,

          name: name,
          company_name: company_name,
          email: email,
          date: date,
          description: description,
          status: status,
          phone: phone,
          postal_address: postal_address,
          web_link: web_link,

        })



      })
      .catch((error) => {
        console.error(error);
      });

  }




  get_members = async () => {


    let api = Connection + 'get_members';
    
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
        console.log("response", response)
        let hasRecord = response.response
        let all_members = []
        if (hasRecord.length != 0) {
          for (let index = 0; index < hasRecord.length; index++) {

            let name = hasRecord[index].name
            let id = hasRecord[index].id
            const sponsor_profile = hasRecord[index].profile_image

            let obj = {
              id: id,
              name: name,
              sponsors: sponsor_profile,
            }

            all_members.push(obj)

          }
          this.setState({
            all_members: all_members
          })
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
      this.setState({
        redirect: 1
      })
    }
    else if (value == 'profile') {
      window.location.reload(false);
    }
    else {
      this.setState({
        redirect: 2
      })
    }
  }
  showmodal() {
    this.setState({
      showmodal: true
    })
  }
  showmodal1() {
    this.setState({
      showmodal1: true
    })
  }
  handleOnSearch = (string, results) => {
    // onSearch will have as the first callback parameter
    // the string searched and for the second the results.
    console.log(string, results)
  }

  handleOnHover = (result) => {
    // the item hovered
    console.log(result)
  }

  handleOnSelect = (item) => {



    //  console.log(a)
    // the item selected
    console.log(item['id'])
    let id = item['id']
    let name = item['name']
    if (this.state.sponsor_name == name || this.state.sponsor_name1 == name) { }
    else {
      if (this.state.show_sponsor_name == false) {

        this.setState({
          show_sponsor_name: true,
          sponsor_id: id,
          sponsor_name: name
        })
      }
      else if (this.state.show_sponsor_name1 == false) {
        this.setState({
          show_sponsor_name1: true,
          sponsor_id1: id,
          sponsor_name1: name
        })
      }
      else {

      }
    }
    setTimeout(
      function () {
        document.getElementsByClassName("sc-hLBbgP")[0].querySelector('input').value = "";

      }, 100);



  }

  handleOnFocus = () => {
    setTimeout(
      function () {
        document.getElementsByClassName("sc-hLBbgP")[0].querySelector('input').value = "";

      }, 100);

    console.log('Focused')
  }

  formatResult = (item) => {
    console.log('Focused11111 ->', item)
  }
  handleClick = () => {
    // 👇️ open file input box on click of other element
    this.inputRef.current.click();
  };
  imagepreview(e) {
    var file = e.target.files[0];

    const MAX_FILE_SIZE = 500 // 5MB
    const fileSizeKiloBytes = file.size / 1024
    console.log(fileSizeKiloBytes)
    if (fileSizeKiloBytes > MAX_FILE_SIZE) {

      this.setState({
        filesize_error: 'File size is greater than maximum limit',
      })
    }
    else {
      this.setState({
        check_image: file,
        filesize_error: '',
        image_url: URL.createObjectURL(e.target.files[0])
        // image_url: `http://192.168.80.130/images/${file.name}`
      })
      setTimeout(() => {
        this.onSubmit()
      }, 1000);
    }
    // setFile(URL.createObjectURL(e.target.files[0]))

    console.log("aa =>", file.name)
    console.log(`image_url: ${this.state.image_url}`)
  }

  onSubmit() {

    const formData = new FormData()
    formData.append('image', this.state.check_image)
    axios.post(Connection + "upload_single_image", formData, {
    }).then(res => {
      console.log(res.data)
      this.setState({
        profile_image_name: res.data
      })
    })
      .catch(err => {
        console.log("error =>", err)
      })
  }

  signup = async () => {

    // ------------------------------------- ========== saveCandidacyProposal BlockChain =========== ---------------------------------------- //
      
      const DAOContract = getDAOContract()
      await DAOContract.saveCandidancyProposal()

      // await DAOContract.wait()

    // ---------------------------------------------- //

    let phone11 = this.state.phone;
    let date = new Date();
    let date1 = moment(date).format("MM-DD-YYYY h:mm:ss a")
    console.log("aaa ->", phone11)
    let id = this.state.id;

    let name = this.state.name;
    if (name != '') {
      name = name.replace(/'/g, '"')
    }
    let company_name = this.state.company_name;
    if (company_name != '') {
      company_name = company_name.replace(/'/g, '"')
    }
    let description = this.state.description;
    if (description != '') {
      description = description.replace(/'/g, '"')
    }
    let phone = this.state.phone;
    let postal_address = this.state.postal_address;
    if (postal_address != '') {
      postal_address = postal_address.replace(/'/g, '"')
    }
    let web_link = this.state.web_link;
    if (web_link != '') {
      web_link = web_link.replace(/'/g, '"')
    }
    let profile_image_name = this.state.profile_image_name;
    let login_email = this.state.login_email;
    let job = this.state.selected_job;
    let api = Connection + "profile_update";
    let sponsord1 = '';
    let sponsord2 = '';
    if (this.state.show_sponsor_name == true) {
      sponsord1 = this.state.sponsor_name
    }
    if (this.state.show_sponsor_name1 == true) {
      sponsord2 = this.state.sponsor_name1
    }
    let email = this.state.email
    phone = phone.replace("+", "/");
    console.log("pass => ", api)
    await fetch(api, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: `id=${id}&name=${name}&company_name=${company_name}&description=${description}&phone=${phone}&postal_address=${postal_address}&web_link=${web_link}&profile_image=${profile_image_name}&job=${job}&date=${date1}&sponsord1=${sponsord1}&sponsord2=${sponsord2}&email=${email}&login_email=${login_email}`,
    })
      .then((response) => response.json())
      .then((response) => {
        console.log("response", response)

        localStorage.setItem('customer', JSON.stringify(response));
        this.setState({
          redirect: 1
        })
        //     if (response == "email already exist") {
        // this.setState({ valid_c_password:true,
        // error_message: 'Email already exist'});


        //     }

        //     else{

        //       localStorage.setItem('customer', JSON.stringify(response));

        //       // Actions.HomeScreen();

        //     }


      })
      .catch((error) => {
        console.error(error);
      });

  }


  update_record = async () => {

    let date = new Date();
    let date1 = moment(date).format("MM-DD-YYYY h:mm:ss a")
    console.log("aaa ->", date1)
    let id = this.state.id;

    let name = this.state.name;
    if (name != '') {
      name = name.replace(/'/g, '"')
    }
    let email = this.state.email;
    let company_name = this.state.company_name;
    if (company_name != '') {
      company_name = company_name.replace(/'/g, '"')
    }
    let description = this.state.description;
    if (description != '') {
      description = description.replace(/'/g, '"')
    }
    let phone = this.state.phone;
    let postal_address = this.state.postal_address;
    if (postal_address != '') {
      postal_address = postal_address.replace(/'/g, '"')
    }
    let web_link = this.state.web_link;
    let profile_image_name = this.state.profile_image_name;

    let job = this.state.selected_job;
    let api = Connection + "profile_update1";
    let sponsord1 = '';
    let sponsord2 = '';
    if (this.state.show_sponsor_name == true) {
      sponsord1 = this.state.sponsor_name
    }
    if (this.state.show_sponsor_name1 == true) {
      sponsord2 = this.state.sponsor_name1
    }

    phone = phone.replace("+", "/");
    // if(split[0])
    console.log("pass => ", phone)
    console.log("pass => ", email)
    console.log("login_email => ", this.state.login_email)
    const login_email = this.state.login_email
    await fetch(api, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      body: `id=${id}&name=${name}&company_name=${company_name}&description=${description}&phone=${phone}&postal_address=${postal_address}&web_link=${web_link}&profile_image=${profile_image_name}&job=${job}&date=${date1}&sponsord1=${sponsord1}&sponsord2=${sponsord2}&email=${email}&login_email=${login_email}`,
    })
      .then((response) => response.json())
      .then((response) => {
        console.log("response", response.response)


        this.setState({
          redirect: 1
        })


      })
      .catch((error) => {
        console.error(error);
      });

  }
  logout() {
    localStorage.removeItem('customer');
    this.setState({
      login: false,
      redirect: 1
    })
  }
  openvotestype() {
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
  selectother() {
    this.setState({ show_selected_job: 'Other', jobshow: 'none', otherjob: true, selected_job: '' })
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
  onfocus() {
    console.log("focus")
  }
  onblur() {
    console.log("blur")

  }
  change_address(value) {
    if (value.target.value == '') {
      this.setState({
        placeholder_show: 'block'
      })
    }
    else {
      this.setState({
        placeholder_show: 'none'
      })
    }
    this.setState({
      postal_address: value.target.value
    })
  }
  render() {
    if (this.state.redirect == 1) {
      return <Navigate push to={`${process.env.PUBLIC_URL}/daovotes`} />;
    }
    if (this.state.redirect == 2) {
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

          <Modal show={this.state.showmodal} size="lg" centered transparent={true} animationType='slide' onHide={() => this.setState({ showmodal: false })}>
            {/* <Modal.Header>Hi</Modal.Header> */}
            <Modal.Body style={{ width: '100%', padding: '5px 15px' }}>
              <div className='row p-3 main_record' style={{ justifyContent: 'center', }}>
                <div className='col-md-2 col-3' style={{ alignItems: 'center', display: 'flex' }}>
                  {this.state.image_url == null ? <img src={logo} alt="test" className='img-fluid candidate_image' /> :
                    <img src={this.state.image_url} className='img-fluid candidate_image' />}

                </div>
                <div className='col-md-10 col-9  d-flex flex-column justify-content-evenly'>
                  <div className='row'>
                    <div className='col-md-9 col-12'>
                      <h5 style={{ fontWeight: 'bold' }}>DAO Member candidacy (48 hours left)</h5>
                    </div>
                    <div className='col-md-3 d-md-block d-none '>
                      <div className='home_active'>
                        <p style={{ textAlign: 'center', color: 'white' }}>Active</p>
                      </div>
                    </div>
                  </div>
                  <div className='col-12 d-md-block d-none'>
                    <h5 style={{ marginTop: '10px', fontSize: '16px', fontWeight: 'bold' }}>{this.state.name} - {this.state.selected_job}</h5>
                    <h5 style={{ fontSize: '16px', fontWeight: 'bold' }}><LinesEllipsis
                      text={this.state.description}
                      maxLine='3'
                      ellipsis='...'
                      trimRight={false}
                      basedOn='words'
                    /></h5>
                    <div className='d-flex mt-3' style={{ alignItems: 'center' }}>
                      {this.state.show_sponsor_name == true || this.state.show_sponsor_name1 == true ?
                        <h5 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '0px' }}>Sponsored By</h5> :
                        <h5 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '0px' }}>Not Sponsored</h5>}
                      {this.state.show_sponsor_name == true && <div className='sponsored_by' >
                        <h5 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '0px' }}>{this.state.sponsor_name}</h5>
                        {this.state.sponsored_1_check == 'true' ? <FontAwesomeIcon style={{ fontSize: '18px', color: '#21b66e', marginLeft: '5px', marginTop: '0px' }} icon={faCircleCheck} /> : <img src={sponsor} style={{ width: '15px', height: '15px', marginLeft: '10px' }} />}
                      </div>}
                      {this.state.show_sponsor_name1 == true && <div className='sponsored_by'>
                        <h5 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '0px' }}>{this.state.sponsor_name1}</h5>
                        {this.state.sponsored_2_check == 'true' ? <FontAwesomeIcon style={{ fontSize: '18px', color: '#21b66e', marginLeft: '5px', marginTop: '0px' }} icon={faCircleCheck} /> : <img src={sponsor} style={{ width: '15px', height: '15px', marginLeft: '10px' }} />}
                      </div>}
                    </div>


                  </div>

                </div>
                <div className='col-12 d-md-none d-block'>
                  <div className='row'>

                    <div className='col-8'>
                      <h5 style={{ marginTop: '10px', fontSize: '16px', fontWeight: 'bold' }}>{this.state.name} - {this.state.selected_job}</h5>

                    </div>
                    <div className='col-4'>
                      <div className='home_active'>
                        <p style={{ textAlign: 'center', color: 'white' }}>Active</p>
                      </div>
                    </div>
                  </div>
                  <h5 style={{ fontSize: '16px', fontWeight: 'bold' }}><LinesEllipsis
                    text={this.state.description}
                    maxLine='3'
                    ellipsis='...'
                    trimRight={false}
                    basedOn='words'
                  /></h5>
                  <div className=' mt-3' style={{ alignItems: 'center' }}>
                    {this.state.show_sponsor_name == true || this.state.show_sponsor_name1 == true ?
                      <h5 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '0px' }}>Sponsored By:</h5> :
                      <h5 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '0px' }}>Not Sponsored</h5>}
                    {this.state.show_sponsor_name == true && <div className='sponsored_by' style={{ marginTop: '10px' }} >
                      <h5 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '0px' }}>{this.state.sponsor_name}</h5>
                      {this.state.sponsored_1_check == 'true' ? <FontAwesomeIcon style={{ fontSize: '18px', color: '#21b66e', marginLeft: '5px', marginTop: '0px' }} icon={faCircleCheck} /> : <img src={sponsor} style={{ width: '15px', height: '15px', marginLeft: '10px' }} />}
                    </div>}
                    {this.state.show_sponsor_name1 == true && <div className='sponsored_by' style={{ marginTop: '10px' }}>
                      <h5 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '0px' }}>{this.state.sponsor_name1}</h5>
                      {this.state.sponsored_2_check == 'true' ? <FontAwesomeIcon style={{ fontSize: '18px', color: '#21b66e', marginLeft: '5px', marginTop: '0px' }} icon={faCircleCheck} /> : <img src={sponsor} style={{ width: '15px', height: '15px', marginLeft: '10px' }} />}
                    </div>}
                  </div>
                </div>
              </div>
            </Modal.Body>
            {/* <Modal.Footer>This is the footer</Modal.Footer> */}
          </Modal>


          <Modal show={this.state.showmodal1} size="lg" centered transparent={true} animationType='slide' onHide={() => this.setState({ showmodal1: false })}>
            {/* <Modal.Header>Hi</Modal.Header> */}
            <Modal.Body style={{ width: '100%', padding: '5px 15px' }}>
              <div className='row p-3 main_record' style={{ justifyContent: 'center', }}>
                <div className='col-md-2 col-3' style={{ alignItems: 'center', display: 'flex' }}>
                  {this.state.image_url == null ? <img src={logo} alt="test" className='img-fluid candidate_image' /> :
                    <img src={this.state.image_url} className='img-fluid candidate_image' />}

                </div>
                <div className='col-md-10 col-9  d-flex flex-column justify-content-evenly'>
                  <div className='row'>
                    <div className='col-md-9 col-12'>
                      <h5 style={{ fontWeight: 'bold' }}>DAO Member <img src={open_batch} className="img_fluid" style={{ width: '20px', height: '30px' }} /></h5>
                    </div>
                    <div className='col-md-3 d-md-block d-none '>
                      <div className='home_closed'>
                        <p style={{ textAlign: 'center', color: 'white' }}>Closed</p>
                      </div>
                    </div>
                  </div>
                  <div className='col-12 d-md-block d-none'>
                    <h5 style={{ marginTop: '10px', fontSize: '16px', fontWeight: 'bold' }}>{this.state.name} - {this.state.selected_job}</h5>
                    <h5 style={{ fontSize: '16px', fontWeight: 'bold' }}><LinesEllipsis
                      text={this.state.description}
                      maxLine='3'
                      ellipsis='...'
                      trimRight={false}
                      basedOn='words'
                    /></h5>
                    <div className='d-flex mt-3' style={{ alignItems: 'center' }}>
                      {this.state.show_sponsor_name == true || this.state.show_sponsor_name1 == true ?
                        <h5 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '0px' }}>Sponsored By</h5> :
                        <h5 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '0px' }}>Not Sponsored</h5>}
                      {this.state.show_sponsor_name == true && <div className='sponsored_by' >
                        <h5 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '0px' }}>{this.state.sponsor_name}</h5>
                        {this.state.sponsored_1_check == 'true' ? <FontAwesomeIcon style={{ fontSize: '18px', color: '#21b66e', marginLeft: '5px', marginTop: '0px' }} icon={faCircleCheck} /> : <img src={sponsor} style={{ width: '15px', height: '15px', marginLeft: '10px' }} />}
                      </div>}
                      {this.state.show_sponsor_name1 == true && <div className='sponsored_by'>
                        <h5 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '0px' }}>{this.state.sponsor_name1}</h5>
                        {this.state.sponsored_2_check == 'true' ? <FontAwesomeIcon style={{ fontSize: '18px', color: '#21b66e', marginLeft: '5px', marginTop: '0px' }} icon={faCircleCheck} /> : <img src={sponsor} style={{ width: '15px', height: '15px', marginLeft: '10px' }} />}
                      </div>}
                    </div>


                  </div>

                </div>
                <div className='col-12 d-md-none d-block'>
                  <div className='row'>

                    <div className='col-8'>
                      <h5 style={{ marginTop: '10px', fontSize: '16px', fontWeight: 'bold' }}>{this.state.name} - {this.state.selected_job}</h5>

                    </div>
                    <div className='col-4'>
                      <div className='home_closed'>
                        <p style={{ textAlign: 'center', color: 'white' }}>Closed</p>
                      </div>
                    </div>
                  </div>
                  <h5 style={{ fontSize: '16px', fontWeight: 'bold' }}><LinesEllipsis
                    text={this.state.description}
                    maxLine='3'
                    ellipsis='...'
                    trimRight={false}
                    basedOn='words'
                  /></h5>
                  <div className=' mt-3' style={{ alignItems: 'center' }}>
                    {this.state.show_sponsor_name == true || this.state.show_sponsor_name1 == true ?
                      <h5 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '0px' }}>Sponsored By:</h5> :
                      <h5 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '0px' }}>Not Sponsored</h5>}
                    {this.state.show_sponsor_name == true && <div className='sponsored_by' style={{ marginTop: '10px' }} >
                      <h5 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '0px' }}>{this.state.sponsor_name}</h5>
                      {this.state.sponsored_1_check == 'true' ? <FontAwesomeIcon style={{ fontSize: '18px', color: '#21b66e', marginLeft: '5px', marginTop: '0px' }} icon={faCircleCheck} /> : <img src={sponsor} style={{ width: '15px', height: '15px', marginLeft: '10px' }} />}
                    </div>}
                    {this.state.show_sponsor_name1 == true && <div className='sponsored_by' style={{ marginTop: '10px' }}>
                      <h5 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '0px' }}>{this.state.sponsor_name1}</h5>
                      {this.state.sponsored_2_check == 'true' ? <FontAwesomeIcon style={{ fontSize: '18px', color: '#21b66e', marginLeft: '5px', marginTop: '0px' }} icon={faCircleCheck} /> : <img src={sponsor} style={{ width: '15px', height: '15px', marginLeft: '10px' }} />}
                    </div>}
                  </div>
                </div>
              </div>
            </Modal.Body>
            {/* <Modal.Footer>This is the footer</Modal.Footer> */}
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
          <div className='maindiv' style={{ margin: 'auto', marginTop: '3.3rem', }}>

            <h5 style={{ fontWeight: 'bold', fontSize: '16px' }}>My Profile</h5>
            <div className='row mt-5' >
              {this.state.type == 'Member' ?
                <div className='col-md-12 col-12 mb-4'>

                  <input type="text" placeholder='Name' disabled value={this.state.name} onChange={(value) => { this.setState({ name: value.target.value, }) }} className='input' style={{ border: 'none', backgroundColor: 'white' }} />

                </div> :
                <div className='col-md-2 col-12 mb-4'>

                  <input type="text" placeholder='Name' value={this.state.name} onChange={(value) => { this.setState({ name: value.target.value, }) }} className='input' />
                </div>}
              {this.state.type != 'Member' && <div className='col-md-10 col-12'></div>}
              <div className='col-md-2 col-12 mb-4'>

                <div onClick={() => { this.handleClick() }} style={{ cursor: 'pointer' }} className='profile_image_design'>
                  {this.state.image_url == null ? <div><h5 style={{ textAlign: 'center' }} >Your photo here</h5><p style={{ fontSize: '10px', textAlign: 'center' }}>(500kb maximum)<br /><span style={{ color: 'red' }}>{this.state.filesize_error}</span></p></div> :
                    <img src={this.state.image_url} className="candidate_image" />}
                </div>
                <input
                  style={{ display: 'none' }}
                  ref={this.inputRef}
                  type="file"
                  onChange={(e) => { this.imagepreview(e) }}
                />
              </div>
              <div className='col-md-3 col-12' style={{ height: 180, }}>
                <input type="text" placeholder='Company Name' value={this.state.company_name} onChange={(value) => { this.setState({ company_name: value.target.value, }) }} className='input' />
                <input type="text" placeholder='Email' value={this.state.email} className='input' onChange={(value) => { this.setState({ email: value.target.value, }) }} style={{ marginTop: '30px' }} />
                <input type="text" placeholder='Phone' value={this.state.phone} className='input' onChange={(value) => { this.setState({ phone: value.target.value }) }} style={{ marginTop: '30px' }} />
                <div className="dropdown dropdown1" style={{ position: 'relative' }}>

                  <button style={{ marginTop: '30px', padding: '0px 10px', }} onClick={() => { this.openvotestype() }} className="dropbtn">{this.state.show_selected_job}<span style={{ marginLeft: '5px' }}><Chevron direction={'down'} /></span></button>
                  <div className="dropdown-content1" style={{ display: this.state.jobshow, height: '300px', overflowX: 'scroll' }}>
                    <a style={{ cursor: 'pointer' }} onClick={() => { this.setState({ selected_job: 'Artist', show_selected_job: 'Artist', jobshow: 'none', otherjob: false }) }}>Artist</a>
                    <a style={{ cursor: 'pointer' }} onClick={() => { this.setState({ selected_job: 'Gallery Director', show_selected_job: 'Gallery Director', jobshow: 'none', otherjob: false }) }}>Gallery Director</a>
                    <a style={{ cursor: 'pointer' }} onClick={() => { this.setState({ selected_job: 'Curator', show_selected_job: 'Curator', jobshow: 'none', otherjob: false }) }}>Curator</a>
                    <a style={{ cursor: 'pointer' }} onClick={() => { this.setState({ selected_job: 'Museum director', show_selected_job: 'Museum director', jobshow: 'none', otherjob: false }) }}>Museum director</a>
                    <a style={{ cursor: 'pointer' }} onClick={() => { this.setState({ selected_job: 'Art space director', show_selected_job: 'Art space director', jobshow: 'none', otherjob: false }) }}>Art space director</a>
                    <a style={{ cursor: 'pointer' }} onClick={() => { this.setState({ selected_job: 'Collector', show_selected_job: 'Collector', jobshow: 'none', otherjob: false }) }}>Collector</a>
                    <a style={{ cursor: 'pointer' }} onClick={() => { this.setState({ selected_job: 'Art dealer', show_selected_job: 'Art dealer', jobshow: 'none', otherjob: false }) }}>Art dealer</a>
                    <a style={{ cursor: 'pointer' }} onClick={() => { this.setState({ selected_job: 'Art critic', show_selected_job: 'Art critic', jobshow: 'none', otherjob: false }) }}>Art critic</a>
                    <a style={{ cursor: 'pointer' }} onClick={() => { this.setState({ selected_job: 'Foundation director', show_selected_job: 'Foundation director', jobshow: 'none', otherjob: false }) }}>Foundation director</a>
                    <a style={{ cursor: 'pointer' }} onClick={() => { this.selectother() }}>Other</a>

                  </div>

                </div>
              </div>
              <div className='col-md-3 col-12' >
                <input type="text" placeholder='Web Link' value={this.state.web_link} onChange={(value) => { this.setState({ web_link: value.target.value, }) }} className='input' />
                <div style={{ position: 'relative' }}><textarea type="text" onFocus={() => { this.onfocus() }} onBlur={() => { this.onblur() }} placeholder='Your postal address : ' style={{ marginTop: "30px", resize: "none", height: '83px' }} onChange={(value) => { this.change_address(value) }} value={this.state.postal_address} className='input' rows="3" ></textarea>
                  <div style={{ display: `${this.state.placeholder_show}` }}>
                    <p style={{ color: '#8f8f8f', position: 'absolute', left: 165, top: 33 }}>9 John street</p>
                    <p style={{ color: '#8f8f8f', position: 'absolute', left: 10, top: 58 }}>10001 New York</p>
                    <p style={{ color: '#8f8f8f', position: 'absolute', left: 13, top: 83 }}>USA</p>



                  </div>
                </div>
                {this.state.otherjob == true && <input type="text" placeholder='Job' value={this.state.selected_job} onChange={(value) => { this.setState({ selected_job: value.target.value, }) }} className='input' style={{ marginTop: '28.7px' }} />}
              </div>
              <div className='col-md-4 col-12'>

                <textarea type="text" placeholder='Describe your motivation to become a DAO member' onChange={(value) => { this.setState({ description: value.target.value, }) }} value={this.state.description} style={{ resize: "none", paddingLeft: '10px', textIndent: '0px', height: '200px' }} className='input' rows="9"></textarea>
              </div>

              <div className='col-md-2 col-12 mb-4' style={{ marginTop: '10px' }}>
                {this.state.type != 'Member' && this.state.date == null && <ReactSearchAutocomplete
                  placeholder='Add a sponsor name'
                  items={this.state.all_members}
                  onSearch={(string, result) => { this.handleOnSearch(string, result) }}
                  onHover={(result) => { this.handleOnHover(result) }}
                  onSelect={(item) => { this.handleOnSelect(item) }}
                  onFocus={() => { this.handleOnFocus() }}
                  showClear={false}

                  styling={{
                    borderrRadius: '20px',
                    border: '1px solid gray',
                    height: '28px',
                    width: '100%',
                    fontSize: '12px',
                    color: 'black',
                    fontWeight: 'bold'
                  }}
                />}
                {/* <input type="text" placeholder='Add a sponsor name' className='input' /> */}
              </div>
              <div className='col-md-3 col-12' >
                {this.state.show_sponsor_name == true && <div className='d-flex' style={{ alignItems: 'center' }}>
                  <div className='input d-flex justify-content-between' style={{ padding: '4px 10px', alignItems: 'center' }}>
                    <h5 style={{ fontSize: '14px' }}>{this.state.sponsor_name}</h5>
                    {this.state.type != 'Member' && this.state.date == null ? <div onClick={() => { this.setState({ show_sponsor_name: false, sponsor_name: '', }) }} className='d-flex justify-content-center' style={{ width: '20px', height: '20px', borderRadius: '15px', backgroundColor: 'red', alignItems: 'center', cursor: 'pointer' }}>
                      <img src={delete_icon} className='img-fluid' />
                      {/* <FontAwesomeIcon style={{fontSize:'12px',color:'black',marginLeft:'0px',}} icon={faTrash}/> */}
                    </div> :
                      <div className='d-flex' style={{ alignItems: 'center' }}>{this.state.sponsored_1_check == 'true' ? <FontAwesomeIcon style={{ fontSize: '20px', color: '#21b66e', marginLeft: '5px', marginTop: '1px' }} icon={faCircleCheck} /> :
                        <img src={sponsor} className='img-fluid' style={{ width: '20px', height: '20px', marginTop: '0px', marginLeft: '5px' }} />}</div>}

                  </div>
                  {this.state.type != 'Member' && this.state.date == null && <div>{this.state.sponsored_1_check == 'true' ? <FontAwesomeIcon style={{ fontSize: '20px', color: '#21b66e', marginLeft: '5px', marginTop: '10px' }} icon={faCircleCheck} /> :
                    <img src={sponsor} className='img-fluid' style={{ width: '20px', height: '20px', marginTop: '10px', marginLeft: '5px' }} />}</div>}
                </div>}
              </div>




              <div className='col-md-3 col-12' >
                {this.state.show_sponsor_name1 == true && <div className='d-flex' style={{ alignItems: 'center' }}>
                  <div className='input d-flex justify-content-between' style={{ padding: '4px 10px', alignItems: 'center' }}>
                    <h5 style={{ fontSize: '14px' }}>{this.state.sponsor_name1}</h5>
                    {this.state.type != 'Member' && this.state.date == null ? <div onClick={() => { this.setState({ show_sponsor_name1: false, sponsor_name1: '' }) }} className='d-flex justify-content-center' style={{ width: '20px', height: '20px', borderRadius: '15px', backgroundColor: 'red', alignItems: 'center', cursor: 'pointer' }}>
                      <img src={delete_icon} className='img-fluid' />
                      {/* <FontAwesomeIcon style={{fontSize:'12px',color:'black',marginLeft:'0px',}} icon={faTrash}/> */}
                    </div> :
                      <div className='d-flex' style={{ alignItems: 'center' }}>{this.state.sponsored_2_check == 'true' ? <FontAwesomeIcon style={{ fontSize: '20px', color: '#21b66e', marginLeft: '5px', marginTop: '0px' }} icon={faCircleCheck} /> :
                        <img src={sponsor} className='img-fluid' style={{ width: '20px', height: '20px', marginTop: '0px', marginLeft: '5px' }} />}</div>}

                  </div>
                  {this.state.type != 'Member' && this.state.date == null && <div>{this.state.sponsored_2_check == 'true' ? <FontAwesomeIcon style={{ fontSize: '20px', color: '#21b66e', marginLeft: '5px', marginTop: '10px' }} icon={faCircleCheck} /> :
                    <img src={sponsor} className='img-fluid' style={{ width: '20px', height: '20px', marginTop: '10px', marginLeft: '5px' }} />}</div>}
                </div>}
              </div>
              <div className='col-md-4 col-12'>

                {this.state.type == 'candidate' && this.state.date == null && <button onClick={() => { this.showmodal() }} className='profile_btn1'>
                  <p style={{ fontSize: '10px', fontWeight: 'bold', textAlign: 'center', marginBottom: '0px' }}>DAO votes view</p>
                </button>}
                {this.state.type == 'Member' && <button onClick={() => { this.showmodal1() }} className='profile_btn1'>
                  <p style={{ fontSize: '10px', fontWeight: 'bold', textAlign: 'center', marginBottom: '0px' }}>DAO member view</p>
                </button>}

              </div>
              <div className='col-12 mb-4'>

                {this.state.type == 'Member' && <button onClick={() => { this.update_record() }} className='profile_btn2'>
                  <p style={{ fontSize: '14px', fontWeight: 'bold', textAlign: 'center', marginBottom: '0px', color: "white" }}>Save</p>
                </button>}
                { console.log(`line: 1364: type: ${this.state.type} date: ${this.state.date}`) }
                {this.state.type == 'candidate' && this.state.date == null && <button onClick={() => { this.signup() }} className='profile_btn2'>
                  <p style={{ fontSize: '14px', fontWeight: 'bold', textAlign: 'center', marginBottom: '0px', color: "white" }}>Submit to DAO</p>
                </button>}
              </div>

            </div>
          </div>

        </div>
      </>
    )
  }
}
export default Profile;