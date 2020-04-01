import React, { Component } from 'react';
import './Home.css';
import 'antd/dist/antd.css';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import config from '../../config.json';
import { Tag, Progress } from 'antd';
import { Doughnut } from 'react-chartjs-2';

class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
      diskNumber : 0,
      chartData : "",
      availableStorageCapacity : 0,
      availableFreeStorageCapacity : 0,
      globalHardDiskUsagePercent : 0
    };
  }
  
  componentWillMount(){
    if(sessionStorage.getItem('connectedUser') == null){
      this.props.history.push("/");
    }else{
      let diskNumber = Object.keys(config.path).length;
      this.setState({diskNumber : diskNumber}, () => {
        axios.get(config.api+'getharddiskusage')
        .then((result) => {
          this.setState({chartData : JSON.parse(result.data)}, () => {
            let availableStorageCapacity = 0;
            let availableFreeStorageCapacity = 0;
            let usedStorageCapacity = 0;
            let globalHardDiskUsagePercent = 0;

            for(let i = 0; i < this.state.diskNumber; i++){
              availableStorageCapacity = availableStorageCapacity + parseInt(this.state.chartData.usage[i].total);
              availableFreeStorageCapacity = availableFreeStorageCapacity + parseInt(this.state.chartData.usage[i].free);
              usedStorageCapacity = usedStorageCapacity + parseInt(this.state.chartData.usage[i].used);
            }

            globalHardDiskUsagePercent = ((100*usedStorageCapacity)/availableStorageCapacity).toFixed(1);

            this.setState({
              availableStorageCapacity : availableStorageCapacity,
              availableFreeStorageCapacity : availableFreeStorageCapacity,
              globalHardDiskUsagePercent : globalHardDiskUsagePercent
            })
          });
        });
      });
    }
  }

  renderHardDiskUsageChart = () => {
    let htmlToReturn = [];

    if(this.state.chartData.usage != undefined){
      for(let i = 0; i < this.state.diskNumber; i++){
        const data = {
          datasets: [{
            data: JSON.parse('['+this.state.chartData.usage[i].free+','+this.state.chartData.usage[i].used+']'),
            backgroundColor: [
              '#E6E6E6',
              '#1890FF'
            ],
            hoverBackgroundColor: [
              '#E6E6E6',
              '#1890FF'
            ]
          }],
          labels: [
            ' Espace libre ',
            ' Espace utilisé '
          ]
        };

        htmlToReturn.push(
          <div className="container-chart">
            <Doughnut 
              data={data} 
              width={100}
              height={50}
              options={{
                legend:{
                  display: false
                }
              }}
            />
            <br/>
            <Tag onClick={this.gotoFileExplorer.bind(this,config.path[i].split('\\')[0])} className="cursor-pointer">Disque : {config.path[i].split('\\')[0]}\</Tag>
          </div>  
        );
      }
    }
    return htmlToReturn;
  }

  gotoFileExplorer = (folder) => {
    this.props.history.push("/fileexplorer?folder="+folder+"/");
  }

  render() {
    return (
      <>
        <Navbar history={this.props.history} />
        <br/><br/>
        <div className="container-informations">
          <Tag color="#1890FF">Disque(s) disponible(s) : {this.state.diskNumber}</Tag>
          &nbsp;&nbsp;
          <Tag color="#1890FF">Capacité totale de stockage : {this.state.availableStorageCapacity} Go</Tag>
          &nbsp;&nbsp;
          <Tag color="#1890FF">Capacité totale de stockage restante : {this.state.availableFreeStorageCapacity} Go</Tag>
        </div>
        <br/>
        <div className="container-informations"><Progress percent={this.state.globalHardDiskUsagePercent} style={{width:"30%"}} status="active"/></div>
        <br/>
        <p className="container-legend"><span className="rectangle used"></span>&nbsp;Espace utilisé &nbsp;&nbsp;&nbsp; <span className="rectangle free"></span>&nbsp;Espace libre</p>
        <div className="container-charts">{this.renderHardDiskUsageChart()}</div>
        <Footer />
      </>
    );
  }
}

export default Home;
