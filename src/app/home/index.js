import React from "react";
import {Link} from "react-router-dom";

import firebase from 'firebase/app'
import { auth } from "../services/firebase";
import { db } from "../services/firebase"

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
  }

  componentDidMount() {

    if (this.props.match) {
      this.setState ({ inviteURL: this.props.match.params.bubbleID })
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
            let bubble = (snapshot.val() && snapshot.val().bubble) || false;
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

  sendResetPWEmail(email) {
    firebase.auth().sendPasswordResetEmail(email).then(function() {
      // Email sent.
    }).catch(function(error) {
      // An error happened.
    });
  }

  toggleInviteVisibility() {
    this.setState({ inviteVisible: !this.state.inviteVisible });
  }

  declineInvite() {
    this.setState({
      inviteBubble: false,
      bubble: false
    })
  }

  acceptInvite(bubbleID) {
    firebase.database().ref('users/' + firebase.auth().currentUser.uid).update({
      bubble: bubbleID,
      admin: false
    });

    firebase.database().ref('bubbles/' + bubbleID + '/members/' + firebase.auth().currentUser.uid).update({
      name: this.state.name
    });

    this.setState({
      bubble: bubbleID,
      inviteBubble: false
    })
  }

  render() {

    return (
      <>
        { !this.state.loading && !this.state.authenticated &&
          <div className="authPage">
            <div>
              <div className="authHeader">
                <h1>Welcome to <b>BubbleUp!</b></h1>
                <p><i>NOTE: We're still in beta, so there will be bugs –
                we're a work in progress!</i> <Link to="/about"><b>Learn more.</b></Link></p>
              </div>
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
                  <div className="submitButton">
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
                <div className="forgotPW">
                  <p>Forgot password?</p>
                  <button onClick={()=>this.sendResetPWEmail(this.state.email)}>Send reset email</button>
                </div>
                <>
                  {this.state.error ? (
                    <p className="authTextError">{this.state.error}</p>
                  ) : null}
                  <div className="submitButton">
                    <Button type="submit">Login</Button>
                  </div>
                </>
              </form>
            </>
            }
            </div>
          </div>
        }
        { !this.state.loading && this.state.authenticated &&
        <div className="background">
          <div className="contentWrapper">
            <div className="welcome">
              <h1>Welcome back, <b>{this.state.name}</b>&nbsp;
                <Link to={{
                  pathname: './user-settings',
                  state: {
                    bubbleID: this.state.bubble
                  }
                }}>
                <FontAwesomeIcon icon={faUserCircle} />
                </Link>
                </h1>
              <div>
                <p>Your last check-in was for {this.state.lastCheckIn} •
                 <button className="signOut" onClick={() => this.signOutUser()}>Sign out</button>
                </p>
                { this.state.bubble &&
                  <Link to={{
                    pathname: '/checkin',
                    state: {
                      bubble: this.state.bubble,
                      name: this.state.name
                    }
                  }}
                  >
                  <Button>
                    <FontAwesomeIcon icon={faCalendarCheck} /> Check-in
                  </Button>
                </Link>
                }
              </div>
            </div>
            { this.state.name &&
              <Bubble
                userID={firebase.auth().currentUser.uid}
                username={this.state.name}
                bubbleID={this.state.bubble}
                admin={this.state.admin}
              />
            }
          </div>
        </div>
        }
        { !this.state.loading && this.state.inviteURL && this.state.authenticated &&
          <Invite
            inviteURL={this.state.inviteURL}
            declineInvite={this.declineInvite}
            acceptInvite={this.acceptInvite}/>
        }
        { this.state.loading &&
          <div className="authPage">
            <div className="inviteCallout">
              <p>Loading...</p>
            </div>
          </div>
        }
      </>
    );
  }

}
