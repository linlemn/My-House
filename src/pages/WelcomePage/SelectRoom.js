import React, { Component } from 'react';
import { Link, BrowserRouter as Router, Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { Carousel } from 'antd';
import Slider from "react-slick";

import './SelectRoom.css'
import 'antd/dist/antd.css';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

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
                <Slider 
                  onChange={this.onChange} 
                  dotPosition='top'
                  draggable={true}
                  swipeToSlide={true}
                  swipe={true}
                  dots={true}
                  slidesToShow={1}
                  slidesToScroll={1}>
                        <div>
                            <img src={`${process.env.PUBLIC_URL}/images/livingRoom.png`} className='carouselImg' onClick={this.clickStart}></img>
                            <h3 className='carousel-h3'>客厅</h3>
                        </div>
                        <div>
                            <img src={`${process.env.PUBLIC_URL}/images/lockedBedroom.png`} className='carouselImg' onClick={this.clickStart}></img>
                            <h3 className='carousel-h3'>卧室</h3>
                        </div>
                    </Slider>
            </div>
        </Router>
        
      );
    }
  }
  
  export default withRouter(SelectRoom);