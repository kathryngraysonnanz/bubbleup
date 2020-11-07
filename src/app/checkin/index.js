import React, { Component } from "react";

import firebase from 'firebase/app'
import { auth } from "../services/firebase";
import { db } from "../services/firebase"

import Button from '../components/button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog, faUserCircle, faCalendarCheck } from '@fortawesome/free-solid-svg-icons'
import './checkin.css';

export default class Checkin extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: auth().currentUser,
      bubbles: [],
      readError: null,
      writeError: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    this.setState({ readError: null });
    try {
      db.ref("bubbles").on("value", snapshot => {
        let bubbles = [];
        snapshot.forEach((snap) => {
          bubbles.push(snap.val());
        });
        this.setState({ bubbles });
      });
    } catch (error) {
      this.setState({ readError: error.message });
    }
  }

  handleChange(event) {
    this.setState({
      bubbles: event.target.value
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ writeError: null });
    try {
      await db.ref("bubbles").push({
        bubbles: this.state.names,
        timestamp: Date.now()
      });
      this.setState({ bubbles: '' });
    } catch (error) {
      this.setState({ writeError: error.message });
    }
  }


  render() {
    return (
      <div className="checkinBackground">
        {console.log(this.props)}
        <div className="contentWrapper">
          <h1><b>Check</b> In</h1>
          <button onClick={()=>this.props.toggle()}>X</button>
        </div>
      </div>
    );
  }

}
