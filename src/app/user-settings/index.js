import React, { Component } from "react";

import firebase from 'firebase/app'
import { auth } from "../services/firebase";
import { db } from "../services/firebase"

import Button from '../components/button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt, faUserCog, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import './user-settings.css';

export default class UserSettings extends React.Component {

  constructor(props) {
    super(props);
    this.updateName = this.updateName.bind(this);
    this.state = {
      user: auth().currentUser,
      readError: null,
      writeError: null,

      username: '',
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      emailAddress: '',
      reminders: '',
      deleteAccount: false,

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
    return (
      <div className="overlayBackground">
        <div className="contentWrapper userSettings">
          <div className="title">
            <h1><b>User</b> Settings</h1>
            <button onClick={()=>this.props.toggle()}><h1>X</h1></button>
          </div>
          <form onSubmit={this.handleSubmit}>
            <h3>Change Username</h3>
            <p>Your username is how you’ll be identified to other members in your
            bubble. It doesn’t have to be your actual name, but
            it should be something your friends will recognize. We
            recommend a first name, nickname, or initials. </p>

            <input onChange={this.updateUsername} type="text" maxLength="60"
            id="username" name="username"/>

            <h3>Change Email Address</h3>

            <input onChange={this.updateEmail} type="text"
            id="email" name="email"/>

            <h3>Change Password</h3>

            <p>Enter your old password:</p>
            <input onChange={this.oldPassword} type="text"
            id="oldPW" name="oldPW"/>

            <p>Choose a new password:</p>
            <input onChange={this.newPassword} type="text"
            id="newPW" name="newPW"/>

            <p>Confirm your new password:</p>
            <input onChange={this.checkPassword} type="text"
            id="checkPW" name="checkPW"/>

            <h3>Check-in Reminders</h3>
            <p>Send me a check-in reminder email:</p>

            <div className="reminderRadio">
              <div>
                <input type="radio" id="daily" name="reminders" value="daily"
                  onClick={(e)=>this.setState({reminders: 'daily'})}/>
                <label for="daily">Daily</label>
              </div>

              <div>
                <input type="radio" id="weekly" name="reminders" value="weekly"
                  onClick={(e)=>this.setState({reminders: 'weekly'})}/>
                <label for="weekly">Weekly</label>
              </div>

              <div>
                <input type="radio" id="biweekly" name="reminders" value="biweekly"
                  onClick={(e)=>this.setState({reminders: 'biweekly'})}/>
                <label for="biweekly">Every other week</label>
              </div>

              <div>
                <input type="radio" id="never" name="reminders" value="never"
                  onClick={(e)=>this.setState({reminders: 'never'})}/>
                <label for="never">Don't send me reminder emails</label>
              </div>
            </div>

            <h3>Delete My Account</h3>
            <p>This will delete your account and erase all your data. You will
            no longer appear as a member in any bubbles, and any data that was
            previously shared in a bubble will be removed. <b>Deleting your account
            is final, and deleted accounts cannot be recovered. </b></p>
            <p className="deleteConfirm">Type "DELETE" to confirm you want to delete your account:</p>
            <input onChange={this.deleteAccount} type="text"
            id="delete" name="delete"/>


            <Button type="submit"> <FontAwesomeIcon icon={faCheckCircle} /> Save changes</Button>
          </form>
        </div>
      </div>
    );
  }

}
