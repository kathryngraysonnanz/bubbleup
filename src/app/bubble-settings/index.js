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
    this.state = {
      user: auth().currentUser,
      readError: null,
      writeError: null,
      invites: '',

      bubbleName: this.props.name
    };

    this.handleChange = this.handleChange.bind(this);
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ writeError: null });

    var invitesArray = this.state.invites.split(',');

    try {
      await db.ref('bubbles/' + this.props.bubbleId).update({
        name: this.state.name,
        pendingMembers: invitesArray
      });
      this.setState({ bubbles: '' });
    } catch (error) {
      this.setState({ writeError: error.message });
    }
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
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
            “My Bubble” if nothing is provided – currently, your bubble's name
            is <b>{this.props.name}</b>. </p>

            <input onChange={this.handleChange} type="text" maxLength="60"
            id="bubbleName" name="bubbleName"/>

            <h3>Invite Members</h3>
            <p>Your bubble should be a small, tight-knit group of people that all
            interact regularly. All members of the bubble will be able
            to see each others' check-in information. <b>You can leave this blank
            for now and add members from the Bubble Settings page later.</b></p>
            <p>Add emails for each person you'd like to invite, separating each
            email address with a comma.</p>
            <textarea id="invites" name="invites" onChange={this.handleChange}></textarea>

            <Button type="submit"> <FontAwesomeIcon icon={faCheckCircle} /> Save changes</Button>
          </form>
        </div>
      </div>
    );
  }

}
