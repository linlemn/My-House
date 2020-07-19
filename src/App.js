import React from 'react';
import logo from './logo.svg';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';

import HouseTemplate from "./pages/WelcomePage/HouseTemplate"

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <Router>
        <Route path="/HouseTemplate" component={HouseTemplate}  />
      </Router>
    </div>
  );
}

export default App;
