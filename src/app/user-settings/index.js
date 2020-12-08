import React from "react";
import {Link} from "react-router-dom";

import firebase from 'firebase/app'
import { auth } from "../services/firebase"
import { db } from "../services/firebase"
import { signin } from '../helpers/auth';

import Button from '../components/button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import './user-settings.css';


export default class UserSettings extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: auth().currentUser,
      readError: null,
      writeError: null,

      email: '',
      password: '',
      reAuth: false,

      username: false,
      newEmail: false,
      reminders: false,
      deleteAccount: false,

    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.updateEmail = this.updateEmail.bind(this);
    this.deleteAccount = this.deleteAccount.bind(this);
  }

  componentDidMount() {

      try {
        db.ref("/users/" + firebase.auth().currentUser.uid).on("value", snapshot => {
          var username = (snapshot.val() && snapshot.val().username) || false;
          let bubble = (snapshot.val() && snapshot.val().bubble) || false;
          var reminders = (snapshot.val() && snapshot.val().reminders) || false;
          var admin = (snapshot.val() && snapshot.val().admin) || false;
          this.setState ({
            admin: admin,
            name: username,
            bubble: bubble,
            reminders: reminders
          })
        });
      } catch (error) {
        this.setState({ readError: error.message });
      }
    }


  updateEmail(newEmail){
    firebase.auth()
    .signInWithEmailAndPassword(this.state.email, this.state.password)
    .then(function(userCredential) {
        userCredential.user.updateEmail(newEmail)
    })
  }

  deleteAccount(){
    firebase.auth()
    .signInWithEmailAndPassword(this.state.email, this.state.password)
    .then(function(userCredential) {
        userCredential.user.delete()
    })
  }

  async handleSignIn(event) {
    event.preventDefault();
    this.setState({ error: '' });
    try {
      await signin(this.state.email, this.state.password);
      this.setState({ reAuth: true })
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ writeError: null });

    var user = firebase.auth().currentUser;
    var bubbleID = this.props.location.state.bubbleID

    try {

      if (this.state.username) {
        db.ref('users/' + user.uid ).update({
          username: this.state.username
        });
        db.ref('bubbles/' + bubbleID + '/members/' + user.uid ).update({
          name: this.state.username
        });
      }

      if (this.state.reminders) {
        db.ref('users/' + user.uid ).update({
          reminders: true
        });
        db.ref('reminders/' + user.uid).set({
          email: this.state.email
        });
      }

      if (this.state.newEmail) {
        this.updateEmail(this.state.newEmail);
        db.ref('users/' + user.uid ).update({
          email: this.state.newEmail
        });
      }

      if (this.state.deleteAccount !== false) {
        if (this.state.deleteAccount.toUpperCase() === "DELETE") {
          this.deleteAccount();
          db.ref('users/' + user.uid ).remove();
        } else {
          console.log("DELETE doesn't match")
        }
      } else {
        console.log("DELETE is false")
      }

      if (this.state.leaveBubble !== false) {
        if (this.state.leaveBubble.toUpperCase() === "LEAVE") {
          db.ref('bubbles/' + bubbleID + '/members/' + user.uid ).remove();
          db.ref('users/' + user.uid + '/bubble').remove();
        } else {
          console.log("LEAVE doesn't match")
        }
      } else {
        console.log("LEAVE is false")
      }
    } catch (error) {
      this.setState({ writeError: error.message });
      console.log("error!")
    }

    this.props.history.push('/');
  }

  sendResetPWEmail(email) {
    firebase.auth().sendPasswordResetEmail(email).then(function() {
      // Email sent.
    }).catch(function(error) {
      // An error happened.
    });
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }
  
  routeToHome() {
    this.props.history.push('/');
  }

  render() {

    if (this.props.location.state === undefined) {
      this.routeToHome()
    }

    return (
      <div className="overlayBackground">
        <div className="contentWrapper userSettings">
          <div className="title">
            <h1><b>User</b> Settings</h1>
            <Link to='/'>
              <h1>X</h1>
            </Link>
          </div>

          <>
          { !this.state.reAuth &&
            <div className="reAuth">
              <p>Please confirm your login before updating your user settings.</p>
              <form onSubmit={this.handleSignIn}>
                <div>
                  <input
                    placeholder="Email"
                    name="email"
                    type="email"
                    onChange={this.handleChange}
                    value={this.state.email}
                  />
                </div>
                <div>
                  <input
                    placeholder="Password"
                    name="password"
                    onChange={this.handleChange}
                    value={this.state.password}
                    type="password"
                  />
                </div>
                {this.state.error &&
                <p class="authTextError">{this.state.error}</p> }
                <div>
                  <Button type="submit">Continue</Button>
                </div>
              </form>
            </div>
          }
          </>
          <>
          { this.state.reAuth &&
          <form onSubmit={this.handleSubmit}>
            <h3>Change Username</h3>
            <p>Your username is how you’ll be identified to other members in your
            bubble. It doesn’t have to be your actual name, but
            it should be something your friends will recognize. We
            recommend a first name, nickname, or initials. </p>

            <input onChange={this.handleChange} type="text" maxLength="60"
            id="username" name="username"/>

            <h3>Change Email Address</h3>
            <input onChange={this.handleChange} type="text"
            id="newEmail" name="newEmail"/>

            <h3>Change Password</h3>

            <p>Clicking the button below will send a password reset email to the
            address you have connected to this account. If you are also changing
            your email address, change and save that first.</p><br/>
            <Button onClick={()=>this.sendResetPWEmail(this.state.email)}>Send Reset Email</Button>
<br/><br/>


            <h3>Check-in Reminders</h3>
            <input
              onClick={(e)=>this.setState({reminders: !this.state.reminders})}
              type="checkbox" id="socialized" name="socialized" checked={this.state.reminders}/>
            <label for="socialized">Yes, send me a weekly check-in reminder email.</label>

            <br/><br/>
            <h3>Leave my bubble</h3>
            <p>This will remove you from the bubble in which you are currently a
            member. You will no longer appear as a member, and any data that was
            previously shared with the bubble will be removed. <b>Once you leave a
            bubble, you must be re-invited in order to re-join.</b></p>
            <br/>
            { this.state.admin &&
              <p><b>You are an admin of this bubble.</b> Before you leave, make
              sure you've designated an new admin in the <Link to='/bubble-settings'>Bubble Settings</Link>.</p>
            }
            <p className="deleteConfirm">Type "LEAVE" to confirm you want to
            leave your current bubble:</p>
            <input onChange={this.handleChange} type="text"
            id="leaveBubble" name="leaveBubble"/>



            <h3>Delete My Account</h3>
            <p>This will delete your account and erase all your data. You will
            no longer appear as a member in your bubble, and any data that was
            previously shared with the bubble will be removed. <b>Deleting your account
            is final, and deleted accounts cannot be recovered. </b></p>
            <p className="deleteConfirm">Type "DELETE" to confirm you want to delete your account:</p>
            <input onChange={this.handleChange} type="text"
            id="deleteAccount" name="deleteAccount"/>

            <div className="submitButton">
              <Button type="submit"> <FontAwesomeIcon icon={faCheckCircle} /> Save changes</Button>
            </div>
          </form>
          }
          </>
        </div>
      </div>
    );
  }

}
