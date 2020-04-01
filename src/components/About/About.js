import React, { Component } from 'react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import './About.css';


class About extends Component {

  componentWillMount(){
    if(sessionStorage.getItem('connectedUser') == null){
      this.props.history.push("/");
    }
  }

  render() {
    return (
      <>
        <Navbar history={this.props.history} />
        <div className="container-about">
          <div className="container-app-name"><img src={process.env.PUBLIC_URL +"/images/rasp.png"}  width="50" className="rasp-logo-title"/><span className="app-name">Rasp NAS</span></div>
          <p>Projet de NAS modulaire sur raspberry pi pilotable à distance via interface web.</p>
          <img src={process.env.PUBLIC_URL +"/images/about.png"}  className="scheme-archi" />
        </div>
        <Footer />
      </>
    );
  }
}

export default About;
