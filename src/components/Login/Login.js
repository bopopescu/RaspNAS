import React, { Component } from 'react';
import LoginForm from './LoginForm/LoginForm';
import Footer from './Footer/Footer';


class Login extends Component {
  render() {
    return (
      <div className="container-login">
        <LoginForm history={this.props.history}/>
        <Footer />
      </div>
    );
  }
}

export default Login;
