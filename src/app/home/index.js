import React, { Component } from "react";

import firebase from 'firebase/app'
import { auth } from "../services/firebase";
import { db } from "../services/firebase"

import Checkin from '../checkin'
import UserSettings from '../user-settings'
import BubbleSetup from '../bubble-setup'
import Bubble from '../bubble'

import { signup, signin, signout } from '../helpers/auth';

import Button from '../components/button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog, faUserCircle, faCalendarCheck, faUsers } from '@fortawesome/free-solid-svg-icons'
import './home.css';

export default class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
      loading: true,
      error: null,
      email: '',
      password: '',
      username: '',
      login: true,

      checkinVisible: false,
      userSettingsVisible: false,
      bubbleSetupVisible: false,

      user: auth().currentUser,
      name: '',
      lastCheckIn: 'never',
      admin: false,
      bubble: false,

      readError: null,
      writeError: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);

    this.toggleCheckinVisibility = this.toggleCheckinVisibility.bind(this);
    this.toggleBubbleSetupVisibility = this.toggleBubbleSetupVisibility.bind(this);
    this.toggleUserSettingsVisibility = this.toggleUserSettingsVisibility.bind(this)
  }

  componentDidMount() {
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

  toggleCheckinVisibility() {
    this.setState({ checkinVisible: !this.state.checkinVisible });
  }

  toggleUserSettingsVisibility() {
    this.setState({ userSettingsVisible: !this.state.userSettingsVisible });
  }

  toggleBubbleSetupVisibility() {
    this.setState({ bubbleSetupVisible: !this.state.bubbleSetupVisible });
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
          { this.state.userSettingsVisible && <UserSettings toggle={this.toggleUserSettingsVisibility}/> }
          { this.state.bubbleSetupVisible && <BubbleSetup toggle={this.toggleBubbleSetupVisibility}/> }
          <div className="contentWrapper">
            <div className="welcome">
              <h1>Welcome back, <b>{this.state.name}</b>&nbsp;
              <button onClick={(e)=>this.toggleUserSettingsVisibility()}>
                <FontAwesomeIcon icon={faUserCircle} />
              </button></h1>
              <div>
                <p>Your last check-in was {this.state.lastCheckIn} •
                 <button className="signOut" onClick={() => this.signOutUser()}>Sign out</button>
                </p>
                <Button onClick={(e)=>this.toggleCheckinVisibility()}>
                  <FontAwesomeIcon icon={faCalendarCheck} /> Check-in
                </Button>
              </div>
            </div>
            { this.state.bubble &&
            <Bubble
              bubbleID={this.state.bubble}
              admin={this.state.admin}
              toggle={this.toggleBubbleSettingsVisibility}
            /> }
          </div>
        </div>
        }
      </>
    );
  }

}
