import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";
import Home from '../home'
import About from '../about'
import Checkin from '../checkin'
import UserSettings from '../user-settings'
import BubbleSettings from '../bubble-settings'
import BubbleSetup from '../bubble-setup'

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/about"
          component={About} />
        <Route path="/checkin"
          component={Checkin} />
        <Route path="/user-settings"
          component={UserSettings} />
        <Route path="/bubble-settings"
          component={BubbleSettings} />
        <Route path="/bubble-setup"
          component={BubbleSetup} />
        <Route path="/:bubbleID"
          component={Home} />
        <Route path="/">
          <Home/>
        </Route>
      </Switch>
    </Router>
  );
}
