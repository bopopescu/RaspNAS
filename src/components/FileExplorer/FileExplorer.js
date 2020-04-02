import React, { Component } from 'react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import './FileExplorer.css';
import axios from 'axios';
import config from '../../config.json';
import { Switch, Breadcrumb, Button, Input, Upload, message } from 'antd';
import { HomeOutlined, FolderOpenOutlined, UploadOutlined } from '@ant-design/icons';
import ModalAddFolder from '../ModalAddFolder/ModalAddFolder';
import ModalVideo from '../ModalVideo/ModalVideo';

const { Search } = Input;


class FileExplorer extends Component {
  constructor(props){
    super(props);
    this.state = {
      path: "",
      content: [],
      switchValue: false,
      searchValue: "",
      showModalMkdir: false,
      showModalVideo: false,
      video: "",
    }
  }

  componentWillMount(){
    if(sessionStorage.getItem('connectedUser') == null){
      this.props.history.push("/");
    }else{
      this.setState({path: this.getUrlParam('folder','undefined')});

      axios.get(config.api+'/getfoldercontent?folder='+this.getUrlParam('folder','undefined'))
      .then((result) => {
        this.setState({content: result.data});
      })
    }
  }

  getUrlVars = () => {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
  }

  getUrlParam = (parameter, defaultvalue) => {
    var urlparameter = defaultvalue;
    if(window.location.href.indexOf(parameter) > -1){
        urlparameter = this.getUrlVars()[parameter];
        }
    return urlparameter;
  }

  onChangeTheme = () => {
    if(this.state.switchValue == true){
      this.setState({switchValue: false});
    }else{
      this.setState({switchValue: true});
    }
  }

  mkdir = () => {
    this.setState({showModalMkdir: true})
  }

  renderContent = () => {
    let htmlToReturn = [];
    let regex = /(?:\.([^.]+))?$/;

    if(this.state.path.split("/").length > 2){
      htmlToReturn.push(<div className="container-element" onClick={this.goBack.bind(this)}><div className="container-img-content"><i className="fas fa-arrow-left fa-3x"></i></div></div>);
    }

    htmlToReturn.push(<div className="container-element" onClick={this.mkdir.bind(this)}><div className="container-img-content"><i className="fas fa-folder-plus fa-3x"></i></div></div>);

    for(let i = 0; i < this.state.content.length; i++){
      let ext;
      if(ext = regex.exec(this.state.content[i])[1] == undefined){ext = "undefined"}
      else{ext = regex.exec(this.state.content[i])[1].toLowerCase()}

      let elementId = "e-"+i;
      let folderId = "f-"+i;
      let musicId = "m-"+i;
      let videoId = "v-"+i;

      if(/^\s+$/.test(this.state.searchValue) || this.state.searchValue == ""){
        if(this.state.switchValue == true){
          if(!this.state.content[i].includes("$")){ // Les dossiers cachés ne sont pas affichés.
            if(ext == "jpg" || ext == "jpeg" || ext == "png" || ext == "psd" || ext == "gif" || ext == "psd" || ext == "bmp" || ext == "ico" || ext == "svg"){
              htmlToReturn.push(<div id={elementId} className="container-element" onClick={this.actionOnElement.bind(this)}><div className="container-img-content"><i className="fas fa-file-image fa-3x"></i></div><p className="filename">{this.state.content[i]}</p></div>);
            }else if(ext == "mp3" || ext == "mpa" || ext == "ogg" || ext == "wav" || ext == "wma" || ext == "midi"){
              htmlToReturn.push(<div id={musicId} className="container-element" onClick={this.actionOnElement.bind(this)}><div className="container-img-content"><i className="fas fa-file-audio fa-3x"></i></div><p className="filename">{this.state.content[i]}</p></div>);
            }else if(ext == "7z" || ext == "deb" || ext == "pkg" || ext == "zip" || ext == "rar" || ext == "rpm" || ext == "tar.gz" || ext == "gz"){
              htmlToReturn.push(<div id={elementId} className="container-element" onClick={this.actionOnElement.bind(this)}><div className="container-img-content"><i className="fas fa-file-archive fa-3x"></i></div><p className="filename">{this.state.content[i]}</p></div>);
            }else if(ext == "avi" || ext == "flv" || ext == "mp4" || ext == "mpg" || ext == "mpeg" || ext == "wmv" || ext == "3gp" || ext == "mov"){
              htmlToReturn.push(<div id={videoId} className="container-element" onClick={this.actionOnElement.bind(this)}><div className="container-img-content"><i className="fas fa-file-video fa-3x"></i></div><p className="filename">{this.state.content[i]}</p></div>);
            }else if(ext == "ppt" || ext == "pptx"){
              htmlToReturn.push(<div id={elementId} className="container-element" onClick={this.actionOnElement.bind(this)}><div className="container-img-content"><i className="fas fa-file-powerpoint fa-3x"></i></div><p className="filename">{this.state.content[i]}</p></div>);
            }else if(ext == "doc" || ext == "docx"){
              htmlToReturn.push(<div id={elementId} className="container-element" onClick={this.actionOnElement.bind(this)}><div className="container-img-content"><i className="fas fa-file-word fa-3x"></i></div><p className="filename">{this.state.content[i]}</p></div>);
            }else if(ext == "xls" || ext == "xlsx" || ext == "xlsm"){
              htmlToReturn.push(<div id={elementId} className="container-element" onClick={this.actionOnElement.bind(this)}><div className="container-img-content"><i className="fas fa-file-excel fa-3x"></i></div><p className="filename">{this.state.content[i]}</p></div>);
            }else if(ext == "odt" || ext == "txt" || ext == "log"){
              htmlToReturn.push(<div id={elementId} className="container-element" onClick={this.actionOnElement.bind(this)}><div className="container-img-content"><i className="fas fa-file-alt fa-3x"></i></div><p className="filename">{this.state.content[i]}</p></div>);
            }else if(ext == "pdf"){
              htmlToReturn.push(<div id={elementId} className="container-element" onClick={this.actionOnElement.bind(this)}><div className="container-img-content"><i className="fas fa-file-pdf fa-3x"></i></div><p className="filename">{this.state.content[i]}</p></div>);
            }else if(ext == "undefined"){
              htmlToReturn.push(<div id={folderId} className="container-element" onClick={this.actionOnElement.bind(this)}><div className="container-img-content"><i className="fas fa-folder-open fa-3x"></i></div><p className="filename">{this.state.content[i]}</p></div>);
            }else{
              htmlToReturn.push(<div id={elementId} className="container-element" onClick={this.actionOnElement.bind(this)}><div className="container-img-content"><i className="fas fa-file fa-3x"></i></div><p className="filename">{this.state.content[i]}</p></div>);
            }
          }
        }else{
          if(!this.state.content[i].includes("$")){ // Les dossiers cachés ne sont pas affichés.
            if(ext == "jpg" || ext == "jpeg" || ext == "png" || ext == "psd" || ext == "gif" || ext == "psd" || ext == "bmp" || ext == "ico" || ext == "svg"){
              htmlToReturn.push(<div id={elementId} className="container-element" onClick={this.actionOnElement.bind(this)}><div className="container-img-content"><i className="far fa-file-image fa-3x"></i></div><p className="filename">{this.state.content[i]}</p></div>);
            }else if(ext == "mp3" || ext == "mpa" || ext == "ogg" || ext == "wav" || ext == "wma" || ext == "midi"){
              htmlToReturn.push(<div id={musicId} className="container-element" onClick={this.actionOnElement.bind(this)}><div className="container-img-content"><i className="far fa-file-audio fa-3x"></i></div><p className="filename">{this.state.content[i]}</p></div>);
            }else if(ext == "7z" || ext == "deb" || ext == "pkg" || ext == "zip" || ext == "rar" || ext == "rpm" || ext == "tar.gz" || ext == "gz"){
              htmlToReturn.push(<div id={elementId} className="container-element" onClick={this.actionOnElement.bind(this)}><div className="container-img-content"><i className="far fa-file-archive fa-3x"></i></div><p className="filename">{this.state.content[i]}</p></div>);
            }else if(ext == "avi" || ext == "flv" || ext == "mp4" || ext == "mpg" || ext == "mpeg" || ext == "wmv" || ext == "3gp" || ext == "mov"){
              htmlToReturn.push(<div id={videoId} className="container-element" onClick={this.actionOnElement.bind(this)}><div className="container-img-content"><i className="far fa-file-video fa-3x"></i></div><p className="filename">{this.state.content[i]}</p></div>);
            }else if(ext == "ppt" || ext == "pptx"){
              htmlToReturn.push(<div id={elementId} className="container-element" onClick={this.actionOnElement.bind(this)}><div className="container-img-content"><i className="far fa-file-powerpoint fa-3x"></i></div><p className="filename">{this.state.content[i]}</p></div>);
            }else if(ext == "doc" || ext == "docx"){
              htmlToReturn.push(<div id={elementId} className="container-element" onClick={this.actionOnElement.bind(this)}><div className="container-img-content"><i className="far fa-file-word fa-3x"></i></div><p className="filename">{this.state.content[i]}</p></div>);
            }else if(ext == "xls" || ext == "xlsx" || ext == "xlsm"){
              htmlToReturn.push(<div id={elementId} className="container-element" onClick={this.actionOnElement.bind(this)}><div className="container-img-content"><i className="far fa-file-excel fa-3x"></i></div><p className="filename">{this.state.content[i]}</p></div>);
            }else if(ext == "odt" || ext == "txt" || ext == "log"){
              htmlToReturn.push(<div id={elementId} className="container-element" onClick={this.actionOnElement.bind(this)}><div className="container-img-content"><i className="far fa-file-alt fa-3x"></i></div><p className="filename">{this.state.content[i]}</p></div>);
            }else if(ext == "pdf"){
              htmlToReturn.push(<div id={elementId} className="container-element" onClick={this.actionOnElement.bind(this)}><div className="container-img-content"><i className="far fa-file-pdf fa-3x"></i></div><p className="filename">{this.state.content[i]}</p></div>);
            }else if(ext == "undefined"){
              htmlToReturn.push(<div id={folderId} className="container-element" onClick={this.actionOnElement.bind(this)}><div className="container-img-content"><i className="far fa-folder-open fa-3x"></i></div><p className="filename">{this.state.content[i]}</p></div>);
            }else{
              htmlToReturn.push(<div id={elementId} className="container-element" onClick={this.actionOnElement.bind(this)}><div className="container-img-content"><i className="far fa-file fa-3x"></i></div><p className="filename">{this.state.content[i]}</p></div>);
            }
          }
        }
      }else{ // La bonne fonction de 200 lignes. Je suis pressé. 
        if(this.state.content[i].toLowerCase().includes(this.state.searchValue.toLowerCase())){
          if(this.state.switchValue == true){
            if(!this.state.content[i].includes("$")){ // Les dossiers cachés ne sont pas affichés.
              if(ext == "jpg" || ext == "jpeg" || ext == "png" || ext == "psd" || ext == "gif" || ext == "psd" || ext == "bmp" || ext == "ico" || ext == "svg"){
                htmlToReturn.push(<div id={elementId} className="container-element" onClick={this.actionOnElement.bind(this)}><div className="container-img-content"><i className="fas fa-file-image fa-3x"></i></div><p className="filename">{this.state.content[i]}</p></div>);
              }else if(ext == "mp3" || ext == "mpa" || ext == "ogg" || ext == "wav" || ext == "wma" || ext == "midi"){
                htmlToReturn.push(<div id={musicId} className="container-element" onClick={this.actionOnElement.bind(this)}><div className="container-img-content"><i className="fas fa-file-audio fa-3x"></i></div><p className="filename">{this.state.content[i]}</p></div>);
              }else if(ext == "7z" || ext == "deb" || ext == "pkg" || ext == "zip" || ext == "rar" || ext == "rpm" || ext == "tar.gz" || ext == "gz"){
                htmlToReturn.push(<div id={elementId} className="container-element" onClick={this.actionOnElement.bind(this)}><div className="container-img-content"><i className="fas fa-file-archive fa-3x"></i></div><p className="filename">{this.state.content[i]}</p></div>);
              }else if(ext == "avi" || ext == "flv" || ext == "mp4" || ext == "mpg" || ext == "mpeg" || ext == "wmv" || ext == "3gp" || ext == "mov"){
                htmlToReturn.push(<div id={videoId} className="container-element" onClick={this.actionOnElement.bind(this)}><div className="container-img-content"><i className="fas fa-file-video fa-3x"></i></div><p className="filename">{this.state.content[i]}</p></div>);
              }else if(ext == "ppt" || ext == "pptx"){
                htmlToReturn.push(<div id={elementId} className="container-element" onClick={this.actionOnElement.bind(this)}><div className="container-img-content"><i className="fas fa-file-powerpoint fa-3x"></i></div><p className="filename">{this.state.content[i]}</p></div>);
              }else if(ext == "doc" || ext == "docx"){
                htmlToReturn.push(<div id={elementId} className="container-element" onClick={this.actionOnElement.bind(this)}><div className="container-img-content"><i className="fas fa-file-word fa-3x"></i></div><p className="filename">{this.state.content[i]}</p></div>);
              }else if(ext == "xls" || ext == "xlsx" || ext == "xlsm"){
                htmlToReturn.push(<div id={elementId} className="container-element" onClick={this.actionOnElement.bind(this)}><div className="container-img-content"><i className="fas fa-file-excel fa-3x"></i></div><p className="filename">{this.state.content[i]}</p></div>);
              }else if(ext == "odt" || ext == "txt" || ext == "log"){
                htmlToReturn.push(<div id={elementId} className="container-element" onClick={this.actionOnElement.bind(this)}><div className="container-img-content"><i className="fas fa-file-alt fa-3x"></i></div><p className="filename">{this.state.content[i]}</p></div>);
              }else if(ext == "pdf"){
                htmlToReturn.push(<div id={elementId} className="container-element" onClick={this.actionOnElement.bind(this)}><div className="container-img-content"><i className="fas fa-file-pdf fa-3x"></i></div><p className="filename">{this.state.content[i]}</p></div>);
              }else if(ext == "undefined"){
                htmlToReturn.push(<div id={folderId} className="container-element" onClick={this.actionOnElement.bind(this)}><div className="container-img-content"><i className="fas fa-folder-open fa-3x"></i></div><p className="filename">{this.state.content[i]}</p></div>);
              }else{
                htmlToReturn.push(<div id={elementId} className="container-element" onClick={this.actionOnElement.bind(this)}><div className="container-img-content"><i className="fas fa-file fa-3x"></i></div><p className="filename">{this.state.content[i]}</p></div>);
              }
            }
          }else{
            if(!this.state.content[i].includes("$")){ // Les dossiers cachés ne sont pas affichés.
              if(ext == "jpg" || ext == "jpeg" || ext == "png" || ext == "psd" || ext == "gif" || ext == "psd" || ext == "bmp" || ext == "ico" || ext == "svg"){
                htmlToReturn.push(<div id={elementId} className="container-element" onClick={this.actionOnElement.bind(this)}><div className="container-img-content"><i className="far fa-file-image fa-3x"></i></div><p className="filename">{this.state.content[i]}</p></div>);
              }else if(ext == "mp3" || ext == "mpa" || ext == "ogg" || ext == "wav" || ext == "wma" || ext == "midi"){
                htmlToReturn.push(<div id={musicId} className="container-element" onClick={this.actionOnElement.bind(this)}><div className="container-img-content"><i className="far fa-file-audio fa-3x"></i></div><p className="filename">{this.state.content[i]}</p></div>);
              }else if(ext == "7z" || ext == "deb" || ext == "pkg" || ext == "zip" || ext == "rar" || ext == "rpm" || ext == "tar.gz" || ext == "gz"){
                htmlToReturn.push(<div id={elementId} className="container-element" onClick={this.actionOnElement.bind(this)}><div className="container-img-content"><i className="far fa-file-archive fa-3x"></i></div><p className="filename">{this.state.content[i]}</p></div>);
              }else if(ext == "avi" || ext == "flv" || ext == "mp4" || ext == "mpg" || ext == "mpeg" || ext == "wmv" || ext == "3gp" || ext == "mov"){
                htmlToReturn.push(<div id={videoId} className="container-element" onClick={this.actionOnElement.bind(this)}><div className="container-img-content"><i className="far fa-file-video fa-3x"></i></div><p className="filename">{this.state.content[i]}</p></div>);
              }else if(ext == "ppt" || ext == "pptx"){
                htmlToReturn.push(<div id={elementId} className="container-element" onClick={this.actionOnElement.bind(this)}><div className="container-img-content"><i className="far fa-file-powerpoint fa-3x"></i></div><p className="filename">{this.state.content[i]}</p></div>);
              }else if(ext == "doc" || ext == "docx"){
                htmlToReturn.push(<div id={elementId} className="container-element" onClick={this.actionOnElement.bind(this)}><div className="container-img-content"><i className="far fa-file-word fa-3x"></i></div><p className="filename">{this.state.content[i]}</p></div>);
              }else if(ext == "xls" || ext == "xlsx" || ext == "xlsm"){
                htmlToReturn.push(<div id={elementId} className="container-element" onClick={this.actionOnElement.bind(this)}><div className="container-img-content"><i className="far fa-file-excel fa-3x"></i></div><p className="filename">{this.state.content[i]}</p></div>);
              }else if(ext == "odt" || ext == "txt" || ext == "log"){
                htmlToReturn.push(<div id={elementId} className="container-element" onClick={this.actionOnElement.bind(this)}><div className="container-img-content"><i className="far fa-file-alt fa-3x"></i></div><p className="filename">{this.state.content[i]}</p></div>);
              }else if(ext == "pdf"){
                htmlToReturn.push(<div id={elementId} className="container-element" onClick={this.actionOnElement.bind(this)}><div className="container-img-content"><i className="far fa-file-pdf fa-3x"></i></div><p className="filename">{this.state.content[i]}</p></div>);
              }else if(ext == "undefined"){
                htmlToReturn.push(<div id={folderId} className="container-element" onClick={this.actionOnElement.bind(this)}><div className="container-img-content"><i className="far fa-folder-open fa-3x"></i></div><p className="filename">{this.state.content[i]}</p></div>);
              }else{
                htmlToReturn.push(<div id={elementId} className="container-element" onClick={this.actionOnElement.bind(this)}><div className="container-img-content"><i className="far fa-file fa-3x"></i></div><p className="filename">{this.state.content[i]}</p></div>);
              }
            }
          }
        }
      }
    }

    return htmlToReturn;
  }

  renderBreadCrumb = () => {
    let htmlToReturn = [];

    let originPath = this.state.path;
    htmlToReturn.push(
      <Breadcrumb.Item onClick={this.returnTo.bind(this,originPath)}>
        <HomeOutlined />
        <span>{this.state.path.split("/")[0]}</span>
      </Breadcrumb.Item>
    );

    for(let i = 1; i < this.state.path.split('/').length - 1; i++){
      let path = this.state.path;
      htmlToReturn.push(
        <Breadcrumb.Item onClick={this.returnTo.bind(this,path)}>
          <FolderOpenOutlined />
          <span>{this.state.path.split('/')[i]}</span>
        </Breadcrumb.Item>
      );
    }

    return htmlToReturn;
  }

  actionOnElement = (e) => {
    let i = e.target.id.split("-")[1];
    let folder = this.state.content[i];
    let path = this.state.path+folder+"/";

    if(e.target.id.split("-")[0] == "f"){ // C'est un dossier
      axios.get(config.api+'/getfoldercontent?folder='+path)
      .then((result) => {
        this.setState({
          path: path,
          content: result.data
        });
      })
    }else if(e.target.id.split("-")[0] == "m"){
      path = this.state.path+folder;
      var audio = new Audio(config.api+"/download?path="+path);
      audio.play();
    }else if(e.target.id.split("-")[0] == "v"){
      path = this.state.path+folder;
      let newPath = config.api+"/download?path="+path;
      this.showVideo(true,newPath);
    }else{ // C'est un fichier
      path = this.state.path+folder;
      window.open(config.api+"/download?path="+path, 'Download');
    }
  }

  returnTo = (e) => {
    axios.get(config.api+'/getfoldercontent?folder='+e)
    .then((result) => {
      this.setState({
        path: e,
        content: result.data
      });
    })
  }

  goBack = (e) => {
    let path = "";
    for(let i = 0; i < this.state.path.split('/').length - 2; i++){
      path = path + this.state.path.split('/')[i] + "/";
    }
    this.returnTo(path);
  }

  setSearch = (e) => {
    this.setState({searchValue: e.target.value})
  }

  setContent = (value) => {
    this.setState({content: value});
  }

  hideModalMkdir = () => {
    this.setState({showModalMkdir: false});
  }

  showVideo = (bool,path) => {
    this.setState({
      showModalVideo: bool,
      video : path
    })
  }
  
  updateContentAfterUpload = () => {
    axios.get(config.api+'/getfoldercontent?folder='+this.state.path)
    .then((result) => {
      this.setState({content: result.data});
    })
  }

  render() {
    const update = () => this.updateContentAfterUpload();
    const pathForUpload = this.state.path;
    const propsUpload = {
      name: 'file',
      action: config.api+"/upload?path="+pathForUpload,
      headers: {
        authorization: 'authorization-text',
      },
      onChange(info) {
        if (info.file.status === 'done') {
          message.success(`${info.file.name} est maintenant sur le NAS`);
          update();
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} erreur lors du dépôt.`);
        }
      },
    };
    return (
      <>
        <Navbar history={this.props.history} disableExplorer={false} />
        <div className="container-switch"><Switch defaultChecked checked={this.state.switchValue} onChange={this.onChangeTheme.bind(this)} /></div>
        <div className="container-download">
          <Upload {...propsUpload} showUploadList={false}>
            <Button>
              <UploadOutlined /> Déposer un fichier
            </Button>
          </Upload>
        </div>
        <div className="container-breadcrumb"><Breadcrumb>{this.renderBreadCrumb()}</Breadcrumb></div>
        <div className="container-search-bar">
          <Search
            placeholder="Effectuer une recherche"
            value={this.state.searchValue}
            onChange={this.setSearch.bind(this)}
            style={{ width: 200 }}
          />
        </div>
        <div className="container-content">
          {this.renderContent()}
        </div>
        {/*<Footer />*/}
        <ModalAddFolder visible={this.state.showModalMkdir} setContent={this.setContent} path={this.state.path} hideModalMkdir={this.hideModalMkdir} />
        <ModalVideo visible={this.state.showModalVideo} showModalVideo={this.showVideo} video={this.state.video} />
      </>
    );
  }
}

export default FileExplorer;
