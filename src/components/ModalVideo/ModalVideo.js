import React, { Component } from 'react';
import axios from 'axios';
import config from '../../config.json';
import {Button, Modal, Col, Row, Form, Input} from 'antd';

class ModalAddFolder extends Component {
  constructor(props){
    super(props);
    this.state = {}
  }

  componentDidMount(){
    console.log(this.props.video);
  }
  cancel = (e) => {
    this.props.showModalVideo(false);
  }

  render() {
    return (
      <Modal
      title={"Vidéo"}
      visible={this.props.visible}
      onCancel={this.cancel.bind(this)}
      footer={
          <div>
            <Button className="ant-btn-normal" onClick={this.cancel.bind(this)}>Fermer</Button>
          </div>
        }
      >
      <div className="container-video" style={{display: "flex", justifyContent: "center"}}>
        <video width="400" height="250" controls>
          <source src={this.props.video} type="video/mp4" />
          Your browser does not support the video tag.
        </video> 
      </div>
    </Modal>
    );
  }
}

export default ModalAddFolder;
