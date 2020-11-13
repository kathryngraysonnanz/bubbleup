import React, { Component } from "react";

import firebase from 'firebase/app'
import { auth } from "../services/firebase";
import { db } from "../services/firebase"

import Button from '../components/button'
import Accordion from '../components/accordion'
import BubbleSettings from '../bubble-settings'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog, faUserCircle, faCalendarCheck, faUsers } from '@fortawesome/free-solid-svg-icons'

import './bubble.css'

export default class Bubble extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      readError: null,
      writeError: null,
      admin: this.props.admin,

      bubbleSettingsVisible: false,
    }
    this.toggleBubbleSettingsVisibility = this.toggleBubbleSettingsVisibility.bind(this)
  }


  toggleBubbleSettingsVisibility() {
    this.setState({ bubbleSettingsVisible: !this.state.bubbleSettingsVisible });
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
            <div key={member[1].name}>
              { member[1].checkin &&
                <Accordion
                  title={member[1].name}
                  isQuarantining={member[1].checkin.quarantining[0]}
                  lastCheckIn={member[1].lastCheckIn}
                  content={
                    <>

                      { member[1].checkin.status[0] &&
                        <div className="status">
                          <p>Status:</p>
                          <div>{member[1].checkin.status[0]}</div>
                        </div>
                      }
                      <div className="questionWrapper">
                        {member[1].checkin.socialized &&
                          <div className="question">
                            <div className="days">
                              <p>
                                {daysSince(member[1].checkin.socialized[1])}
                              </p>
                              <p>days</p>
                            </div>
                            <p>Since last socialization outside the bubble
                            {member[1].checkin.unmasked[0] && <> (unmasked) </>}
                            {member[1].checkin.indoors[0] && <> (indoors) </>}
                            {member[1].checkin.notDistant[0] && <> (notDistant) </>}
                            </p>
                          </div>
                        }

                        {member[1].checkin.travel &&
                          <div className="question">
                            <div className="days">
                              <p>
                                {daysSince(member[1].checkin.travel[1])}
                              </p>
                              <p>days</p>
                            </div>
                            <p>Since last travel outside the city / town
                            {member[1].checkin.overnight[0] && <> (overnight) </>}
                            </p>
                          </div>
                        }

                        {member[1].checkin.publicTransport &&
                          <div className="question">
                            <div className="days">
                              <p>
                                {daysSince(member[1].checkin.publicTransport[1])}
                              </p>
                              <p>days</p>
                            </div>
                            <p>Since last use of public transportation
                            </p>
                          </div>
                        }

                        {member[1].checkin.publicSpace &&
                          <div className="question">
                            <div className="days">
                              <p>
                                {daysSince(member[1].checkin.publicSpace[1])}
                              </p>
                              <p>days</p>
                            </div>
                            <p>Since the last time they spent more than 15 minutes
                            unmasked in a public space
                            </p>
                          </div>
                        }

                        {member[1].checkin.tested &&
                          <div className="question">
                            <div className="days">
                              <p>
                                {daysSince(member[1].checkin.tested[1])}
                              </p>
                              <p>days</p>
                            </div>
                            <p>Since their last Covid-19 test
                            {member[1].checkin.testResults && <> (results:
                               <b> {member[1].checkin.testResults}</b>)</>}
                            </p>
                          </div>
                        }

                        {member[1].checkin.contactPositive &&
                          <div className="question">
                            <div className="days">
                              <p>
                                {daysSince(member[1].checkin.contactPositive[1])}
                              </p>
                              <p>days</p>
                            </div>
                            <p>Since they last heard someone they were in regular
                            contact with tested positive for Covid-19
                            </p>
                          </div>
                        }

                        {member[1].checkin.symptoms &&
                          <div className="question">
                            <div className="days">
                              <p>
                                {daysSince(member[1].checkin.symptoms[1])}
                              </p>
                              <p>days</p>
                            </div>
                            <p>Since they last experienced symptoms suspicious of
                            Covid-19
                            </p>
                          </div>
                        }
                      </div>
                    </>
                  }
                />
              }
            </div>
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

    return (
      <div className="bubble">
        { this.state.bubbleSettingsVisible &&
          <BubbleSettings
            toggle={this.toggleBubbleSettingsVisibility}
            members={this.state.members}
            name={this.state.name}
            bubbleId={this.props.bubbleID}
          />
        }
        { this.props.bubbleID &&
          <>
          <div className="bubbleInfo">
            <div className="bubbleName">
              <h2>{this.state.name}</h2>
              <button onClick={(e) => this.toggleBubbleSettingsVisibility()}>
                <h2>{ this.state.admin && <FontAwesomeIcon icon={faCog} /> }</h2>
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
