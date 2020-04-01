import React, { Component } from 'react';
import RegisterForm from '../RegisterForm/RegisterForm';
import Footer from '../Footer/Footer';


class Register extends Component {
  render() {
    return (
      <div className="container-register">
        <RegisterForm history={this.props.history}/>
        <Footer />
      </div>
    );
  }
}

export default Register;
