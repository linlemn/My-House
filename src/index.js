import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Link, BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import HouseTemplate from './pages/WelcomePage/HouseTemplate'
import WelcomePage from './pages/WelcomePage/WelcomePage'
import SelectRoom from './pages/WelcomePage/SelectRoom'
import * as serviceWorker from './serviceWorker';


import { TransitionGroup, CSSTransition } from 'react-transition-group'

ReactDOM.render(
  // <React.StrictMode>
  <div>
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
            <CSSTransition
              appear={true}
              classNames="appAppear"
              timeout={500}
            >
              <Route exact path="/HouseTemplate">
                <HouseTemplate />
              </Route>
            </CSSTransition>
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
  //  </React.StrictMode>
  ,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
