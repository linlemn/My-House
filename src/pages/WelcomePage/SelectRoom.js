import React, { Component } from 'react';
import { Link, BrowserRouter as Router, Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { Carousel } from 'antd';

import './SelectRoom.css'
import 'antd/dist/antd.css';

const DEFAULT_TITLE = 'Default title';

class SelectRoom extends Component {
    constructor(props) {
      super(props);
      this.clickStart = this.clickStart.bind(this);
      this.state = {
        title1: DEFAULT_TITLE,
        currentModal: null,
      };
    }
  
    clickStart = () => {
      this.props.history.push('./HouseTemplate')
    }

    onChange = (a, b, c) => {
        console.log(a, b, c);
      }
  
    render() {
      const { currentModal } = this.state;
  
      return (
        <Router>
            <div className='container'>
                <Carousel onChange={this.onChange}>
                        <div onClick={this.clickStart}>
                            <img src={`${process.env.PUBLIC_URL}/images/livingRoom.png`} className='carouselImg'></img>
                            <h3>客厅</h3>
                        </div>
                        <div>
                            <img src={`${process.env.PUBLIC_URL}/images/lockedBedroom.png`} className='carouselImg'></img>
                            <h3>卧室</h3>
                        </div>
                    </Carousel>
            </div>
        </Router>
        
      );
    }
  }
  
  export default withRouter(SelectRoom);