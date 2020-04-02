import React, { Component } from 'react';
import axios from 'axios';
import config from '../../config.json';
import {Button, Modal, Col, Row, Form, Input} from 'antd';

class ModalAddFolder extends Component {
  constructor(props){
    super(props);
    this.state = {
      nameFolder : "",
    }
  }

  addContent = () => {
    let path = this.props.path + this.state.nameFolder;
    axios.post(config.api+'/mkdir',{path})
    .then((result) => {
      axios.get(config.api+'/getfoldercontent?folder='+this.props.path)
      .then((result) => {
          this.props.setContent(result.data);
          this.props.hideModalMkdir(false);
        });
      })
  }

  cancel = (e) => {
    this.props.hideModalMkdir(false);
  }

  setNameFolder = (e) => {
    this.setState({nameFolder : e.target.value});
  }

  render() {
    return (
      <Modal
      title={"Ajouter un dossier"}
      visible={this.props.visible}
      onCancel={this.cancel.bind(this)}
      footer={
          <div>
            <Button className="ant-btn-normal" onClick={this.cancel.bind(this)}>Annuler</Button>
            <Button type="primary" onClick={this.addContent.bind(this)}>Ajouter</Button>  
          </div>
        }
      >
      <Form onSubmit={this.addContent}>
        <Form.Item style={{marginBottom: "-5px"}}>
          <Row>
            <Col span={3} style={{paddingTop: "3px"}}><label>Nom : </label></Col>
            <Col span={21}><Input value={this.state.nameFolder} onChange={this.setNameFolder.bind(this)} /></Col>
          </Row>
        </Form.Item>
      </Form>
    </Modal>
    );
  }
}

export default ModalAddFolder;
