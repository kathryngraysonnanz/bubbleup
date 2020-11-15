import React from "react";
import {Link} from "react-router-dom";

import firebase from 'firebase/app'
import { auth } from "../services/firebase";
import { db } from "../services/firebase"

import Checkin from '../checkin'
import UserSettings from '../user-settings'
import Bubble from '../bubble'

import { signup, signin } from '../helpers/auth';

import Button from '../components/button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCircle, faCalendarCheck } from '@fortawesome/free-solid-svg-icons'
import './invitation.css';

export default class Invite extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      name: "hold"
    }
  }

  componentDidMount(){
    let bubbleID = this.props.match.params.bubbleID;

    try {
      db.ref("/bubbles/" + bubbleID).on("value", snapshot => {
        var name = (snapshot.val() && snapshot.val().name) || null;
        this.setState ({
          name: name,
          bubbleID: bubbleID
        });
      });
    } catch (error) {
      this.setState({ name: false });
    }
  }

  render(){
    return (
      <div className="authPage">
        { this.state.name &&
          <div className="inviteCallout">
            {this.state.name === "hold" &&
              <p>loading</p>
            }
            {this.state.name !== "hold" &&
              <>
                <h3>You've been invited to join the bubble: <b>{this.state.name}</b></h3>
                <p><b>NOTE:</b> You cannot be in two bubbles at once. If you are
                already part of a bubble, clicking "Join" will
                remove you from your current bubble and add you to this one.</p>
                <div>
                  <Link to="/">Decline invitation</Link>
                  <Link to={"/home/"+this.state.bubbleID}><Button>Join</Button></Link>
                </div>
              </>
            }
          </div>
        }

        { !this.state.name &&
          <p>We could not find a bubble that matched this invitation.<br/> Please
          check the URL or ask the admin of the bubble you're trying to join
          to send you a new link.</p>
        }
      </div>
    )
  }
}
