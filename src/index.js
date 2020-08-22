import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Link, BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import HouseTemplate from './pages/WelcomePage/HouseTemplate'
import WelcomePage from './pages/WelcomePage/WelcomePage'
import SelectRoom from './pages/WelcomePage/SelectRoom'
import * as serviceWorker from './serviceWorker';
import {UserAgentProvider, UserAgent} from '@quentin-sommer/react-useragent'


import { TransitionGroup, CSSTransition } from 'react-transition-group'

ReactDOM.render(
  <UserAgentProvider ua={window.navigator.userAgent}>
    <div><div className="forced-landscape">
    <Router>
      <TransitionGroup>
        <CSSTransition
          appear={true}
          classNames="appAppear"
          timeout={500}
        >
          <Switch>
            <Route exact path="/">
              <WelcomePage />
            </Route>
            <Route exact path="/HouseTemplate">
              <HouseTemplate />
            </Route>
            <TransitionGroup>
              <CSSTransition
                appear={true}
                classNames="appAppear"
                timeout={500}
              >
                <Route exact path="/SelectRoom">
                  <SelectRoom />
                </Route>
              </CSSTransition>
            </TransitionGroup>
          </Switch></CSSTransition>
      </TransitionGroup></Router>
    </div>
    <div className="vertical">请横屏使用哦~</div></div>
  </UserAgentProvider>
  // <React.StrictMode>
  //  </React.StrictMode>
  ,
  document.getElementById('root')
);

// var width = document.documentElement.clientWidth;
// var height =  document.documentElement.clientHeight;
// if( width < height ){
//     console.log(width + " " + height);
//     const page =  document.querySelector('.forced-landscape');
//     console.log(page)
//     page.style.width = height;
//     page.style.height = width;
//     page.style.top = height-width/2 ;
//     page.style.left = 0-(height-width)/2 ;
//     // page.style.transform = 'rotate(90deg)';
//     // page.style.transformOrigin='50% 50%';
// } 

// var evt = "onorientationchange" in window ? "orientationchange" : "resize";
      
// window.addEventListener(evt, function() {
//     var width = document.documentElement.clientWidth;
//      var height =  document.documentElement.clientHeight;
//      const page =  document.querySelector('.forced-landscape');
//      if( width > height ){
       
//         page.style.width = width ;
//         page.style.height = height;
//         page.style.top = 0;
//         page.style.left =  0;
//         page.style.transform='none';
//         page.style.transformOrigin = '50% 50%';
//      }
//      else{
//         page.style.width = height ;
//         page.style.height = width;
//         page.style.top = (height-width)/2;
//         page.style.left =  0-(height-width)/2;
//         page.style.transform='rotate(90deg)';
//         page.style.transformOrigin = '50% 50%';
//      }
    
// }, false);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
