import React from "react";
import {Link} from "react-router-dom";

import { db } from "../services/firebase"
import firebase from 'firebase/app'

import Button from '../components/button'
import Accordion from '../components/accordion'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog, faUsers } from '@fortawesome/free-solid-svg-icons'

import './bubble.css'

export default class Bubble extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      readError: null,
      writeError: null,
      admin: this.props.admin
    }
  }

  componentDidMount(){
    try {
      db.ref("/bubbles/" + this.props.bubbleID).on("value", snapshot => {
        var members = (snapshot.val() && snapshot.val().members) || null;
        var pendingMembers = (snapshot.val() && snapshot.val().pendingMembers) || null;
        var name = (snapshot.val() && snapshot.val().name) || null;
        var link = (snapshot.val() && snapshot.val().link) || null;
        this.setState ({
          members: members,
          pendingMembers: pendingMembers,
          name: name,
          link: link
        });
      });
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  rescindApplication() {
    db.ref('bubbles/' + this.props.bubbleID + '/pendingMembers/' + firebase.auth().currentUser.uid).remove();

    db.ref('users/' + firebase.auth().currentUser.uid + '/pendingBubble').remove()
  }



  render() {

    function mapOverMembers(members, userID){
      return (
        <>
          {Object.entries(members).map(member =>
            <div key={member[1].name}>
              { member[1].checkin &&
                <Accordion
                  title={member[1].name}
                  userID={userID}
                  memberID={member[0]}
                  lastCheckIn={member[1].lastCheckIn}
                  content={
                    <>
                      { member[1].checkin.status[0] &&
                        <div className="status">
                          <p>Status:</p>
                          <div>{member[1].checkin.status[0]}</div>
                        </div>
                      }
                      {member[1].checkin.quarantining &&
                        <div className="status">
                          {member[1].checkin.quarantining[0] &&
                            <>
                            <p><b>Currently quarantining: </b>
                            {member[1].checkin.quarantineEnd[0] &&
                              <i>ends on {member[1].checkin.quarantineEnd[0]}</i>
                            }
                            {!member[1].checkin.quarantineEnd[0] &&
                              <i>unknown end date.</i>
                            }
                            </p>
                            </>
                        }
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
        { this.props.bubbleID &&
          <>
          <div className="bubbleInfo">
            <div className="bubbleName">
              <h2>{this.state.name}</h2>
              { this.state.admin &&
                <Link to={{
                  pathname: '/bubble-settings',
                  state: {
                    link: this.state.link,
                    members: this.state.members,
                    pendingMembers: this.state.pendingMembers,
                    name: this.state.name,
                    bubbleId: this.props.bubbleID
                  }
                }}>
                  <h2>{ this.state.admin && <FontAwesomeIcon icon={faCog}/> }</h2>
                </Link>
              }
            </div>
          </div>
          <div className="members">
            {this.state.members && mapOverMembers(this.state.members, this.props.userID)}
          </div>
          </>
        }
        { !this.props.bubbleID && this.props.pendingBubble &&
          <div className="noBubble">
            <h3>Your bubble membership is pending!</h3>
            <p>For the privacy & safety of all bubble members, new members
            must be approved by an admin before they can join the bubble. Check
            back soon!
           </p>
           <Button onClick={()=>this.rescindApplication()}>Rescind membership application</Button>
          </div>
        }
        { !this.props.bubbleID && !this.props.pendingBubble &&
          <div className="noBubble">
            <h3>You're not part of a bubble yet!</h3>
            <p>For privacy purposes, bubbles are invitation-only and
            non-discoverable. You must be invited by a member in order
            to join an existing bubble.
           </p>
             <Link to={{
               pathname: '/bubble-setup',
               state: {
                 username: this.props.username
               }
             }}>
              <Button><FontAwesomeIcon icon={faUsers} /> Start a new bubble</Button>
            </Link>
          </div>
        }
      </div>
    )
  }

}
