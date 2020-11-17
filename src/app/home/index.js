import React from "react";

import firebase from 'firebase/app'
import { auth } from "../services/firebase";
import { db } from "../services/firebase"

import Checkin from '../checkin'
import UserSettings from '../user-settings'
import Bubble from '../bubble'
import Invite from '../invitation'

import { signup, signin } from '../helpers/auth';

import Button from '../components/button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCircle, faCalendarCheck } from '@fortawesome/free-solid-svg-icons'
import './home.css';

export default class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
      loading: true,
      login: true,

      checkinVisible: false,
      userSettingsVisible: false,
      inviteVisible: true,

      user: auth().currentUser,
      lastCheckIn: 'never',
      admin: false,
      bubble: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);

    this.declineInvite = this.declineInvite.bind(this);
    this.acceptInvite = this.acceptInvite.bind(this);

    this.toggleInviteVisibility = this.toggleInviteVisibility.bind(this);
    this.toggleCheckinVisibility = this.toggleCheckinVisibility.bind(this);
    this.toggleUserSettingsVisibility = this.toggleUserSettingsVisibility.bind(this)
  }

  componentDidMount() {

    let bubbleID = false
    if (this.props.match) {
      bubbleID = this.props.match.params.bubbleID;
      this.setState ({ inviteBubble: bubbleID })
    }

    auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          authenticated: true,
          loading: false,
        });

        try {
          db.ref("/users/" + firebase.auth().currentUser.uid).on("value", snapshot => {
            var username = (snapshot.val() && snapshot.val().username) || 'User';
            let bubble = (snapshot.val() && snapshot.val().bubble) || bubbleID;
            var admin = (snapshot.val() && snapshot.val().admin) || false;
            var lastCheckIn = (snapshot.val() && snapshot.val().lastCheckIn) || 'never';
            this.setState ({
              name: username,
              bubble: bubble,
              admin: admin,
              lastCheckIn: lastCheckIn
            })
          });
        } catch (error) {
          this.setState({ readError: error.message });
        }

      } else {
        this.setState({
          authenticated: false,
          loading: false,
        });
      }
    });
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  writeUserData(userId, email, username) {
    firebase.database().ref('users/' + userId).set({
      email: email,
      username: username,
      bubble: false,
      lastCheckIn: 'never'
    });
  }

  async handleSignUp(event) {
    event.preventDefault();
    this.setState({ error: '' });
    try {
      await signup(this.state.email, this.state.password);
    } catch (error) {
      this.setState({ error: error.message });
    }
    this.writeUserData(
      firebase.auth().currentUser.uid,
      firebase.auth().currentUser.email,
      this.state.username
    )
  }

  async handleSignIn(event) {
    event.preventDefault();
    this.setState({ error: '' });
    try {
      await signin(this.state.email, this.state.password);
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  signOutUser() {
    firebase.auth().signOut().then(function() {
    }).catch(function(error) {
    });
  }

  toggleCheckinVisibility() {
    this.setState({ checkinVisible: !this.state.checkinVisible });
  }

  toggleUserSettingsVisibility() {
    this.setState({ userSettingsVisible: !this.state.userSettingsVisible });
  }

  toggleInviteVisibility() {
    this.setState({ inviteVisible: !this.state.inviteVisible });
  }

  declineInvite() {
    this.setState({ inviteBubble: false })
  }

  acceptInvite() {
    firebase.database().ref('users/' + firebase.auth().currentUser.uid).update({
      bubble: this.state.inviteBubble,
      admin: false
    });

    firebase.database().ref('bubbles/' + this.state.inviteBubble + '/members/' + firebase.auth().currentUser.uid).update({
      name: this.state.name
    });

    this.setState({
      bubble: this.state.inviteBubble,
      inviteBubble: false
    })
  }

  render() {

    return (
      <>
        { !this.state.authenticated &&
          <div className="authPage">
            <div>
            <h1>Welcome to <b>BubbleUp!</b></h1>
            { !this.state.login &&
              <>
                <h3>
                  Create an account
                </h3>
                <p>Already have an account?  <button onClick={()=>this.setState({ login: true })}>Login!</button></p>
                <form onSubmit={this.handleSignUp} className="signup">
                  <div>
                    <input placeholder="Email" name="email" type="email"
                    onChange={this.handleChange} value={this.state.email}></input>
                  </div>
                  <div>
                    <input placeholder="Username" name="username" type="username"
                    onChange={this.handleChange} value={this.state.username}></input>
                  </div>
                  <div>
                    <input placeholder="Password" name="password" type="password"
                    onChange={this.handleChange} value={this.state.password}></input>
                  </div>
                  <div>
                    {this.state.error ? <p>{this.state.error}</p> : null}
                    <Button type="submit">Sign up</Button>
                  </div>
                </form>
              </>
            }
            { this.state.login &&
              <>
              <h3>
                Login to your account
              </h3>
              <p>No account? <button onClick={()=>this.setState({ login: false })}>Create one!</button></p>
              <form onSubmit={this.handleSignIn} className="signin">
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
                <div>
                  {this.state.error ? (
                    <p>{this.state.error}</p>
                  ) : null}
                  <Button type="submit">Login</Button>
                </div>
              </form>
            </>
            }
            </div>
          </div>
        }
        { this.state.authenticated &&
        <div className="background">
          { this.state.checkinVisible &&
            <Checkin
              toggle={this.toggleCheckinVisibility}
              bubble={this.state.bubble}
              name={this.state.name}
            />
          }
          { this.state.userSettingsVisible &&
            <UserSettings
            bubbleID={this.state.bubble}
            toggle={this.toggleUserSettingsVisibility}/>
          }

          <div className="contentWrapper">
            <div className="welcome">
              <h1>Welcome back, <b>{this.state.name}</b>&nbsp;
              <button onClick={(e)=>this.toggleUserSettingsVisibility()}>
                <FontAwesomeIcon icon={faUserCircle} />
              </button></h1>
              <div>
                <p>Your last check-in was for {this.state.lastCheckIn} •
                 <button className="signOut" onClick={() => this.signOutUser()}>Sign out</button>
                </p>
                <Button onClick={(e)=>this.toggleCheckinVisibility()}>
                  <FontAwesomeIcon icon={faCalendarCheck} /> Check-in
                </Button>
              </div>
            </div>
            { this.state.name &&
              <Bubble
                userID={firebase.auth().currentUser.uid}
                username={this.state.username}
                bubbleID={this.state.bubble}
                admin={this.state.admin}
                toggle={this.toggleBubbleSettingsVisibility}
              />
            }
          </div>
        </div>
        }
        { this.state.inviteBubble &&
          <Invite
            bubbleID={this.state.inviteBubble}
            declineInvite={this.declineInvite}
            acceptInvite={this.acceptInvite}/>
        }
      </>
    );
  }

}
