import React, { Component } from 'react';
import { Link, BrowserRouter as Router, Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { Shake } from 'reshake'

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
              <div>
              <Shake h={0} v={0} r={30} dur={2000} int={10} max={100} fixed={true} fixedStop={true} freez={true}>
                <p class="titleTextY"> LEGO HOME </p>
              </Shake>
              <p className="titleText">You Deserve a Dream Home!</p>
                {/* <Shake h={10} v={0} r={3}><p class="titleTextY"> LEGO ROOM? </p></Shake> */}
              </div>
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