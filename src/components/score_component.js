import React, { Component } from 'react'

import logo from './images/avatar2.png';
import matic from './images/matic.png';
import usdc from './images/usdc.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateRight, faCopy } from '@fortawesome/free-solid-svg-icons';
import Image_path from '../image_path';

import { getDAOContract } from '../utils/constants'

class Score_Component extends Component {
  constructor(props) {
    super(props);

    this.state = {  
      test: "home1",
      showmodal: false,
      sideshow: 'none',
      name: '',
      image_url: '',
      score: '',
      governanceTokens: ''
    };

  }
  componentDidMount = async () => {

    const DAOContract = getDAOContract()
    const _score = await DAOContract.getScore()
    const _governanceTokens = await DAOContract.getGovernanceTokens()
    
    this.setState({
      score: parseInt(_score),
      governanceTokens: parseInt(_governanceTokens)
    })
    
    // console.log(`Score: ${this.state.score} and Governance Tokens: ${this.state.governanceTokens}`)

    let user = await localStorage.getItem('customer');

    if (user != null) {

      console.log("aaaaaaaaaaaaa", user);
      let parsed = JSON.parse(user);
      let name = parsed[0].name
      if (name == null || name == '') {
        name = 'Name'
      }
      let profile_image = parsed[0].profile_image
      if (profile_image == null || profile_image == "null" || profile_image == "") {

      }
      else {
        this.setState({
          profile_image_name: profile_image,
          image_url: 'http://localhost:8080/images/' + profile_image
        })
      }
      this.setState({
        name: name
      })
    }
    else {

    }


  }


  render() {
    return (

      <div className='score_div' style={{}} >


        <div className='d-flex justify-content-between' style={{ borderBottom: '1px solid gray', padding: '10px', alignItems: 'center' }}>
          <div className='d-flex' style={{ alignItems: 'center' }}>
            {this.state.image_url == '' ?
              <img src={logo} alt="test" className='img-fluid' style={{ width: '30px', height: '30px', marginLeft: '10px' }} /> :
              <img src={this.state.image_url} alt="test" className='img-fluid' style={{ width: '30px', height: '30px', borderRadius: '20px', marginLeft: '10px', objectFit: 'cover' }} />}
            <p style={{ fontWeight: 'bold', color: 'black', marginLeft: '10px' }}>{this.state.name}</p>
          </div>
          <FontAwesomeIcon style={{ fontSize: '20px' }} icon={faRotateRight} />
        </div>

        <div style={{ padding: '20px' }}>
          <h3 style={{ textAlign: 'center', fontWeight: 'bold' }}>Score</h3>
          <h1 style={{ textAlign: 'center', fontWeight: 'bold' }}>{this.state.score}</h1>
          <h3 style={{ textAlign: 'center', fontWeight: 'bold', marginTop: '15px' }}>Governance Token</h3>
          <h1 style={{ textAlign: 'center', fontWeight: 'bold' }}>{this.state.governanceTokens}</h1>
        </div>
        <hr className='m-0' />
        <div style={{ padding: '0px 20px' }}>
          <button className=' wallet_btn1' style={{ marginBottom: '10px' }}>


            <p style={{ fontWeight: 'bold', color: '#767f88', fontSize: '12px' }}>Total Balance</p>
            <p style={{ fontWeight: 'bold', color: 'black', fontSize: '14px' }}>$26,09 USD</p>
            <div className='d-flex justify-content-center' style={{ alignItems: 'center' }}>
              <p style={{ fontWeight: 'bold', color: '#767f88', fontSize: '12px' }}>0xe2...12sd</p>
              <FontAwesomeIcon style={{ fontSize: '12px', color: '#767f88', marginLeft: '5px' }} icon={faCopy} />
            </div>

          </button>

          <button className='d-flex wallet_btn2 justify-content-between' >

            <div className='d-flex' style={{ alignItems: 'center' }}>
              <img src={matic} className='img-fluid' style={{ width: '35px', height: '30px', marginRight: '10px', objectFit: 'cover' }} />
              {/* <FontAwesomeIcon style={{fontSize:'23px',color:'#7840d6',marginRight:'10px'}} icon={faEthereum}/> */}
              <div>
                <p style={{ fontWeight: 'bold', color: 'black', fontSize: '12px', textAlign: 'left' }}>MATIC</p>
                <p style={{ fontWeight: 'bold', color: '#767f88', fontSize: '10px', textAlign: 'left' }}>Polygon</p>
              </div>
            </div>
            <div>
              <p style={{ fontWeight: 'bold', color: 'black', fontSize: '12px', textAlign: 'right' }}>0,0003</p>
              <p style={{ fontWeight: 'bold', color: '#767f88', fontSize: '10px', textAlign: 'right' }}>$0,10 USD</p>
            </div>


          </button>
          <button className='d-flex wallet_btn2 justify-content-between' >

            <div className='d-flex' style={{ alignItems: 'center' }}>
              <img src={usdc} className='img-fluid' style={{ width: '35px', height: '30px', marginRight: '10px', objectFit: 'cover' }} />

              {/* <FontAwesomeIcon style={{fontSize:'23px',color:'#7840d6',marginRight:'10px'}} icon={faCircleDollarToSlot}/> */}
              <div>
                <p style={{ fontWeight: 'bold', color: 'black', fontSize: '12px', textAlign: 'left' }}>USDC</p>
                <p style={{ fontWeight: 'bold', color: '#767f88', fontSize: '10px', textAlign: 'left' }}>Polygon</p>
              </div>
            </div>
            <div>
              <p style={{ fontWeight: 'bold', color: 'black', fontSize: '12px', textAlign: 'right' }}>0,0003</p>
              <p style={{ fontWeight: 'bold', color: '#767f88', fontSize: '10px', textAlign: 'right' }}>$0,10 USD</p>
            </div>


          </button>


        </div>

      </div>
    )
  }
}
export default Score_Component;