import React, { Component } from 'react';
import './Footer.css';


class Footer extends Component {
  render() {
    return (
      <>
        <footer>
          <img src={process.env.PUBLIC_URL +"/images/rasp.png"} alt="logo-raspberry" height="20" className="footer-logo"/>
        </footer>
      </>
    );
  }
}

export default Footer;
