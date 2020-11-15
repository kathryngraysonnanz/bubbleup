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
          <Route path="/home/:bubbleID"
            component={Home} />
          <Route path="/:bubbleID"
            component={Invite} />
          <Route path="/">
            <Home/>
          </Route>
        </Switch>
    </Router>
  );
}
