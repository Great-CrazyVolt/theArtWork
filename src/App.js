import logo from './logo.svg';
import { BrowserRouter as Router, Route, Switch,Routes,useNavigate } from 'react-router-dom';
import Home from './components/home';
import Test from './components/test';
import Profile from './components/profie';
import Vote_Details from './components/vote_details';
import Header from './components/header';

import './App.css';

function App() {
  const navigation = useNavigate()
  return (
    <>
    <Routes>
          <Route exact path={`${process.env.PUBLIC_URL}/`}   element={<Header/>}/>
          <Route exact path={`${process.env.PUBLIC_URL}/daovotes`}   element={<Home/>}/>
          <Route exact path={`${process.env.PUBLIC_URL}/myprofile`}   element={<Profile/>}/>
          <Route exact path={`${process.env.PUBLIC_URL}/profile`}   element={<Vote_Details/>}/>
        </Routes>
   
      
    </>
  );
}

export default App;
