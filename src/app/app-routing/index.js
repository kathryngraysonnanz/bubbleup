import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Home from '../home'
import Invite from '../invitation'

export default function App() {
  return (
    <Router>
        <Switch>

          <Route path="/:bubbleID"
            component={Invite} />
          <Route path="/home/:bubbleName"
            component={Home} />
        </Switch>
    </Router>
  );
}
