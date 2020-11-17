import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";
import Home from '../home'
import About from '../about'

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/about"
          component={About} />
        <Route path="/:bubbleID"
          component={Home} />
        <Route path="/">
          <Home/>
        </Route>
      </Switch>
    </Router>
  );
}
