import React, { Component } from 'react';
import axios from 'axios';
import config from '../../config.json';
import '../Login/LoginRegister.css';
import { message } from 'antd';

class RegisterForm extends Component {

  constructor() {
    super();
    this.state = {
      username: '',
      password1: '',
      password2: '',
      passwordVisibilityState1: 'Afficher',
      passwordType1: 'password',
      passwordVisibilityState2: 'Afficher',
      passwordType2: 'password',
      registerIsVisible: 'user-modal is-visible',
      message: ''
    };
  }
  onChange = (e) => {
    const state = this.state
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  onSubmit = (e) => {
    e.preventDefault();
    const { username, password1, password2 } = this.state;

    if(password1 != password2){
      this.setState({message : "Le mot de passe et sa confirmation diffèrent."});
    }

    if(password1.length <= 6){
      this.setState({message : "Le mot de passe doit comporter plus de 6 caractères."});
    }
    
    if(username.length <= 3){
      this.setState({message : "Le nom d'utilisateur doit comporter plus de 3 caractères."});
    }

    if(password1 == password2 && password1.length > 6 && username.length >= 3){
      axios.post(config.api+'/register', {username:username,password:password1})
      .then((result) => {
        console.log(result.data)
        if(result.data == "True"){
          this.setState({ message: 'Succès ! Vous allez être redirigé vers la connexion dans 5.' });
          setTimeout(() => {this.setState({ message: 'Succès ! Vous allez être redirigé vers la connexion dans 4.' })},1000);
          setTimeout(() => {this.setState({ message: 'Succès ! Vous allez être redirigé vers la connexion dans 3.' })},2000);
          setTimeout(() => {this.setState({ message: 'Succès ! Vous allez être redirigé vers la connexion dans 2.' })},3000);
          setTimeout(() => {this.setState({ message: 'Succès ! Vous allez être redirigé vers la connexion dans 1.' })},4000);
          setTimeout(() => {this.props.history.push('/')},5000);
        }else if(result.data == "go login"){
          this.setState({ message: 'Un utilisateur est déjà présent en base.\nVous allez être redirigé vers la connexion dans 5.' });
          setTimeout(() => {this.setState({ message: 'Un utilisateur est déjà présent en base.\nVous allez être redirigé vers la connexion dans 4.' })},1000);
          setTimeout(() => {this.setState({ message: 'Un utilisateur est déjà présent en base.\nVous allez être redirigé vers la connexion dans 3.' })},2000);
          setTimeout(() => {this.setState({ message: 'Un utilisateur est déjà présent en base.\nVous allez être redirigé vers la connexion dans 2.' })},3000);
          setTimeout(() => {this.setState({ message: 'Un utilisateur est déjà présent en base.\nVous allez être redirigé vers la connexion dans 1.' })},4000);
          setTimeout(() => {this.props.history.push('/')},5000);
        }else{
          //API down or DB down.
          this.setState({ message: 'Une erreur interne est survenue.' });
        }
      });
    }
  }

  showHidePassword1 = (e) => {
    e.preventDefault();
    if(this.state.passwordVisibilityState1 === "Afficher"){
      this.setState({passwordVisibilityState1:'Cacher'});
      this.setState({passwordType1:'text'});
    }
    else if(this.state.passwordVisibilityState1 === "Cacher"){
      this.setState({passwordVisibilityState1:'Afficher'});
      this.setState({passwordType1:'password'});
    }
  }

  showHidePassword2 = (e) => {
    e.preventDefault();
    if(this.state.passwordVisibilityState2 === "Afficher"){
      this.setState({passwordVisibilityState2:'Cacher'});
      this.setState({passwordType2:'text'});
    }
    else if(this.state.passwordVisibilityState2 === "Cacher"){
      this.setState({passwordVisibilityState2:'Afficher'});
      this.setState({passwordType2:'password'});
    }
  }
  
  hrefLogin = (e) => {
    e.preventDefault();
    this.props.history.push('/');
    this.setState({registerIsVisible:"user-modal"});
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
    const { username, password1, password2, passwordVisibilityState1, passwordType1, passwordVisibilityState2, passwordType2, registerIsVisible, message } = this.state;
    return (
      <div className={registerIsVisible}>
       <div className="user-modal-container">
         <ul className="switcher">
           <li><a href="/login" onClick={this.hrefLogin}>Connexion</a></li>
           <li><a className="selected" >Inscription</a></li>
         </ul>
          <div id="signup">
            <form className="form" onSubmit={this.onSubmit}>
            {message !== '' &&
                <div className="alert alert-warning alert-dismissible" role="alert">
                {this.returnMessage(message)}
                </div>
              } 
              <p className="fieldset">
               <label className="image-replace username" for="signup-username">Nom d'utilisateur</label>
               <input className="full-width has-padding has-border" id="signup-email" name="username" type="text" placeholder="Nom d'utilisateur" value={username} onChange={this.onChange} required />
               <span className="error-message"></span>
              </p>
              <p className="fieldset">
               <label className="image-replace password" for="signup-password">Mot de passe</label>
               <input className="full-width has-padding has-border" id="signup-password" name="password1" type={passwordType1}  placeholder="Mot de passe" value={password1} onChange={this.onChange} required />
               <a className="hide-password" id="showHide" onClick={this.showHidePassword1}>{passwordVisibilityState1}</a>
               <span className="error-message">Your password has to be at least 6 characters long!</span>
              </p>
             <p className="fieldset">
               <label className="image-replace password" for="signup-password">Confirmation de mot de passe</label>
               <input className="full-width has-padding has-border" id="signup-password" name="password2" type={passwordType2}  placeholder="Confirmation de mot de passe" value={password2} onChange={this.onChange} required />
               <a className="hide-password" id="showHide" onClick={this.showHidePassword2}>{passwordVisibilityState2}</a>
               <span className="error-message">Your password has to be at least 6 characters long!</span>
              </p>
              <p className="fieldset">
                <input className="full-width has-padding" type="submit" value="S'inscrire" />
              </p>
           </form>
         </div>
       </div>
      </div>
    );
  }
}

export default RegisterForm;
