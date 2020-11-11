import React, { Component } from "react";

import firebase from 'firebase/app'
import { auth } from "../services/firebase";
import { db } from "../services/firebase"

import Button from '../components/button'
import Accordion from '../components/accordion'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog, faUserCircle, faCalendarCheck, faUsers } from '@fortawesome/free-solid-svg-icons'

import './bubble.css'

export default class Bubble extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      readError: null,
      writeError: null
    }
  }

  componentDidMount(){
    try {
      console.log(this.props.bubbleID)
      db.ref("/bubbles/" + this.props.bubbleID).on("value", snapshot => {
        var members = (snapshot.val() && snapshot.val().members) || null;
        var name = (snapshot.val() && snapshot.val().name) || null;
        this.setState ({
          members: members,
          name: name
        });
      });
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  render() {

    function mapOverMembers(members){
      return (
        <>
          {Object.entries(members).map(member =>
            <Accordion
              title="Name"
              isQuarantining={member[1].checkin.quarantining[0]}
              lastCheckIn="last check in"
              content={
                <>
                  { member[1].checkin.status &&
                    <div className="status">
                      <p>Status:</p>
                      <div>{member[1].checkin.status}</div>
                    </div>
                  }
                  {member[1].checkin && mapOverCheckIn(member[1].checkin)}
                </>
              }
            />
          )}
        </>
      )
    }

    function daysSince(date){
      let currentDate = new Date();
      let questionDate = new Date(date);

      let timeDifference = currentDate.getTime() - questionDate.getTime();
      let dayDifference = timeDifference / (1000 * 3600 * 24);

      return Math.round(dayDifference)
    }

    function mapOverCheckIn(checkin){
      return (
        <div className="questionWrapper">
          {Object.entries(checkin).map((key, value) =>
            <>
              { key[1][0] &&
                <div className="question">
                  <div className="days">
                    <p>
                      {daysSince(key[1][1])}
                    </p>
                    <p>days</p>
                  </div>
                  <p>{key[0]}</p>
                </div>
              }
            </>
          )}
        </div>
      )
    }



    return (
      <div className="bubble">
        { this.props.bubbleID &&
          <>
          <div className="bubbleInfo">
            <div className="bubbleName">
              <h2>{this.state.name}</h2>
              <button onClick={(e)=>this.toggleBubbleSettingsVisibility()}>
                <h2>{ this.state.isAdmin && <FontAwesomeIcon icon={faCog} /> }</h2>
              </button>
            </div>
          </div>
          <div className="members">
            {this.state.members && mapOverMembers(this.state.members)}
          </div>
          </>
        }
        { !this.props.bubbleID &&
          <div className="noBubble">
            <h3>You're not part of a bubble yet!</h3>
            <p>For privacy purposes, bubbles are invitation-only and
            non-discoverable. You must be invited by a member in order
            to join an existing bubble.
           </p>
            <Button onClick={(e)=>this.toggleBubbleSetupVisibility()}><FontAwesomeIcon icon={faUsers} /> Start a new bubble</Button>
          </div>
        }
      </div>
    )
  }

}
