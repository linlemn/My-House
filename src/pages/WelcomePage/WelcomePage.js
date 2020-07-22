import React, { Component } from 'react';
import { Link, BrowserRouter as Router, Switch, Route, Redirect, withRouter } from 'react-router-dom';
import HouseTemplate from './HouseTemplate'

import toy from './icons/Lego-Toy.png'
import process from './icons/Process.png'
import right from './icons/right.png'
import './WelcomePage.css'


const DEFAULT_TITLE = 'Default title';

class WelcomePage extends Component {
    constructor(props) {
      super(props);
      this.clickStart = this.clickStart.bind(this);
      this.state = {
        title1: DEFAULT_TITLE,
        currentModal: null,
      };
    }
  
    clickStart = () => {
      this.props.history.push('./SelectRoom')
    }
  
    render() {
      const { currentModal } = this.state;
  
      return (
        <Router>
          <div className="WelcomePage">
            {/* <img src={toy}  className="backLego"></img> */}
            <text className="titleText">Do You Wanna</text>
            <text className="titleText">build<text class="titleTextY"> LEGO ROOM? </text></text>
            <img src={process} className="progress"></img>
            <img src={right} className="startIcon" onClick={this.clickStart}></img>
            <text className="startText">Let's start!</text>
            {/* <Switch>
              <Route exact path="/">
                <WelcomePage />
              </Route>
              <Redirect exact path="/HouseTemplate">
                <HouseTemplate />
              </Redirect>
            </Switch> */}
          </div>
        </Router>
        
      );
    }
  }
  
  export default withRouter(WelcomePage);