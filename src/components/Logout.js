import React, { Component } from 'react';
import ReactDOM from 'react-dom';


class Logout extends Component {

  logout = () => {
    sessionStorage.clear();
    sessionStorage.setItem("plsLogin","Déconnexion réussie.");
    this.props.history.push("ldap-login");
  }

  render() {
    return(
      <form class="form-inline my-2 my-lg-0">
        <a class="nav-link" class="nav-link" onClick={this.logout.bind(this)}><i class="fas fa-power-off fa-lg"></i></a>
      </form>
    );
  }
}

export default Logout;
