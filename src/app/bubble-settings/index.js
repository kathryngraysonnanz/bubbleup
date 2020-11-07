import React, { Component } from "react";

import firebase from 'firebase/app'
import { auth } from "../services/firebase";
import { db } from "../services/firebase"

import Button from '../components/button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog, faUserCircle, faCalendarCheck } from '@fortawesome/free-solid-svg-icons'
import './bubble-settings.css';

export default class BubbleSettings extends React.Component {

  constructor(props) {
    super(props);
    this.updateEndDate = this.updateEndDate.bind(this);
    this.state = {
      user: auth().currentUser,
      readError: null,
      writeError: null,
    };
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

  updateEndDate(event) {
    this.setState({ quarantineEnd: event.target.value });
  }

  render() {
    return (
      <div className="overlayBackground">
        <div className="contentWrapper">
          <div className="title">
            <h1><b>Bubble</b> Settings</h1>
            <button onClick={()=>this.props.toggle()}><h1>X</h1></button>
          </div>
          <form onSubmit={this.handleSubmit}>

            <Button type="submit">Save changes</Button>
          </form>
        </div>
      </div>
    );
  }

}
