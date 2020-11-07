import React, { Component } from "react";

import firebase from 'firebase/app'
import { auth } from "../services/firebase";
import { db } from "../services/firebase"

import Button from '../components/button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt, faUserCog, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import './bubble-settings.css';

export default class BubbleSettings extends React.Component {

  constructor(props) {
    super(props);
    this.updateName = this.updateName.bind(this);
    this.state = {
      user: auth().currentUser,
      readError: null,
      writeError: null,

      bubbleName: '',
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

  updateName(event) {
    this.setState({ bubbleName: event.target.value });
  }

  render() {

    let members = ["Adam", "K"]

    function renderMemberEditRows(members){
      return (
        <>
        {members && members.map(member => (
          <tr>
            <td>{member}</td>
            <td><button><FontAwesomeIcon icon={faUserCog} /> <span>Promote to admin</span></button></td>
            <td><button><FontAwesomeIcon icon={faSignOutAlt} /> <span>Remove from bubble</span></button></td>
          </tr>
        ))}
        </>
      )
    }

    return (
      <div className="overlayBackground">
        <div className="contentWrapper bubbleSettings">
          <div className="title">
            <h1><b>Bubble</b> Settings</h1>
            <button onClick={()=>this.props.toggle()}><h1>X</h1></button>
          </div>
          <div className="editBubbleMembers">
            <h3>Bubble Members</h3>
            <p><b>Everyone listed here can see the data shared by users within the
            bubble.</b></p>
            <p>Only admins can change bubble settings, including
            promoting members to admin and removing members.
            Once a member is promoted to admin, they cannot be demoted. There is no
            limit to the number of admin users in a bubble.</p>
            <p>Removed members must be reinvited and reapproved in order
            to rejoin. Removing a member removes all their
            previously shared data from the bubble.</p>

            <table>
              <tbody>
              {renderMemberEditRows(members)}
              </tbody>
            </table>
          </div>
          <form onSubmit={this.handleSubmit}>
            <h3>Bubble Name</h3>
            <p>Bubble names are optional and just for fun. We’ll use the name
            “My Bubble” if nothing is provided. </p>

            <input onChange={this.updateName} type="text" maxLength="60"
            id="bubbleName" name="bubbleName"/>

            <Button type="submit"> <FontAwesomeIcon icon={faCheckCircle} /> Save changes</Button>
          </form>
        </div>
      </div>
    );
  }

}
