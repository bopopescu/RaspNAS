import React, { Component } from 'react';
import { Menu } from 'antd';

const { SubMenu } = Menu;

class Navbar extends Component {
  constructor(props){
    super(props);
    this.state = {
      current: 'mail',
      disableExplorer: true,
    }
  }
  
  componentWillMount(){
    if(this.props.disableExplorer == false){
      this.setState({disableExplorer:false})
    }
  }

  handleClick = (e) => {
    this.setState({
      current: e.key,
    });
  }

  logout = () => {
    sessionStorage.clear();
    this.props.history.push("/");
  }

  render() {
    return (
      <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal">
        <Menu.Item key="brand" style={{color:"#1890FF"}}>
          <img src={process.env.PUBLIC_URL +"/images/rasp.png"} alt="logo-raspberry" height="20" className="logo-app" style={{marginTop:"-5px"}} />
          &nbsp;&nbsp;
          <b>Rasp NAS</b>
        </Menu.Item>
        <Menu.Item key="home" onClick={() => {this.props.history.push("/home")}}>
          <i className="fas fa-home"></i>
          &nbsp;&nbsp;<b>Accueil</b>
        </Menu.Item>
        <Menu.Item key="explorer" disabled={this.state.disableExplorer}>
          <i className="fas fa-folder-open"></i>
          &nbsp;&nbsp;<b>Explorateur de fichiers</b>
        </Menu.Item>
        <Menu.Item key="about" onClick={() => {this.props.history.push("/about")}}>
          <i className="fas fa-question-circle"></i>
          &nbsp;&nbsp;<b>À propos</b>
        </Menu.Item>
        <Menu.Item key="logout" onClick={this.logout.bind(this)}>
          <i className="fas fa-power-off"></i>
          &nbsp;&nbsp;<b>Déconnexion</b>
        </Menu.Item>
      </Menu>
    );
  }
}

export default Navbar;
