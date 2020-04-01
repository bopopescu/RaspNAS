import React, { Component } from 'react';
import axios from 'axios';
import config from '../../config.json';



class LoginForm extends Component {

  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      message: '',
      passwordVisibilityState: 'Afficher',
      passwordType: 'password',
      loginIsVisible : 'user-modal is-visible'
    };
  }
  componentWillMount(){
    if(sessionStorage.getItem("plsLogin") != null){
      this.setState({message : sessionStorage.getItem("plsLogin")});
      sessionStorage.removeItem("plsLogin");
    }
  }
  onChange = (e) => {
    const state = this.state
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  onSubmit = (e) => {
    e.preventDefault();

    const { username, password } = this.state;

    axios.post(config.api+'/login', { username, password })
      .then((result) => {
        if(result.data == "go register"){
          this.setState({ message: 'Aucun utilisateur présent en base.\nVous allez être redirigé vers l\'inscription dans 5.' });
          setTimeout(() => {this.setState({ message: 'Aucun utilisateur présent en base.\nVous allez être redirigé vers l\'inscription dans 4.' })},1000);
          setTimeout(() => {this.setState({ message: 'Aucun utilisateur présent en base.\nVous allez être redirigé vers l\'inscription dans 3.' })},2000);
          setTimeout(() => {this.setState({ message: 'Aucun utilisateur présent en base.\nVous allez être redirigé vers l\'inscription dans 2.' })},3000);
          setTimeout(() => {this.setState({ message: 'Aucun utilisateur présent en base.\nVous allez être redirigé vers l\'inscription dans 1.' })},4000);
          setTimeout(() => {this.props.history.push('/register')},5000);
        }else if( result.data == "True"){
          sessionStorage.setItem("connectedUser",username);
          this.props.history.push('/home')
        }else{
          this.setState({ message: 'Votre identifiant ou votre mot de passe est incorrect.' });
        }
      }
    )
  }

  showHidePassword = (e) => {
    e.preventDefault();
    if(this.state.passwordVisibilityState === "Afficher"){
      this.setState({passwordVisibilityState:'Cacher'});
      this.setState({passwordType:'text'});
    }
    else if(this.state.passwordVisibilityState === "Cacher"){
      this.setState({passwordVisibilityState:'Afficher'});
      this.setState({passwordType:'password'});
    }
  }

  hrefRegister = (e) => {
    e.preventDefault();
    this.props.history.push('/register');
    this.setState({loginIsVisible:"user-modal"});
  }

  returnMessage = (message) => {
    let htmlToReturn = [];
    if(message.split('\n').length > 1){
      htmlToReturn.push(message.split('\n')[0]);
      htmlToReturn.push(<br/>);
      htmlToReturn.push(message.split('\n')[1]);
    }else{
      htmlToReturn.push(message);
    }
    return htmlToReturn;
  }

  render() {
    const { username, password, message, passwordVisibilityState, passwordType, loginIsVisible } = this.state;
    return (
      <div className={loginIsVisible}>
        <div className="user-modal-container">
          <ul className="switcher">
            <li><a className="selected">Connexion</a></li>
            <li><a href="/register" onClick={this.hrefRegister}>Inscription</a></li>
           </ul>
          <div id="login">
            <form className="form" onSubmit={this.onSubmit}>
              {message !== '' &&
                <div className="alert alert-warning alert-dismissible" role="alert">
                {this.returnMessage(message) }
                </div>
              } 
              <p className="fieldset">
                <label className="image-replace username" for="signup-username">Nom d'utilisateur</label>
                <input className="full-width has-padding has-border" id="signup-email" name="username" type="text" placeholder="Nom d'utilisateur" value={username} onChange={this.onChange} required />
                <span className="error-message"></span>
              </p>
              <p className="fieldset">
                <label className="image-replace password" for="signin-password">Password</label>
                <input className="full-width has-padding has-border" id="signin-password" name="password" type={passwordType}  placeholder="Mot de passe" value={password} onChange={this.onChange} required/>
                <a className="hide-password" id="showHide" onClick={this.showHidePassword}>{passwordVisibilityState}</a>
                <span className="error-message">Wrong password! Try again.</span>
              </p>
              <p className="fieldset">
                <input className="full-width" type="submit" value="Se connecter"/>
              </p>
            </form>
          </div>
         </div>
      </div>
    );
  }
}

export default LoginForm;
