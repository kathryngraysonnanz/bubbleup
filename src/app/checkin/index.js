import React, { Component } from "react";

import firebase from 'firebase/app'
import { auth } from "../services/firebase";
import { db } from "../services/firebase"

import Button from '../components/button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog, faUserCircle, faCalendarCheck } from '@fortawesome/free-solid-svg-icons'
import './checkin.css';

export default class Checkin extends React.Component {

  constructor(props) {
    super(props);
    this.updateEndDate = this.updateEndDate.bind(this);
    this.updateStatus = this.updateStatus.bind(this);
    this.state = {
      user: auth().currentUser,
      readError: null,
      writeError: null,

      socialized: false,
      indoors: false,
      unmasked: false,
      notDistant: false,

      travel: false,
      overnight: false,

      publicTransport: false,

      publicSpace: false,

      tested: false,
      testResults: '',

      contactPositive: false,

      symptoms: false,

      quarantining: false,
      quarantineEnd: '',

      status: ''
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

  updateEndDate(event) {
    this.setState({ quarantineEnd: event.target.value });
  }

  updateStatus(event) {
    this.setState({ status: event.target.value });
  }

  render() {

    let today = new Date().toISOString().substring(0,10);

    return (
      <div className="checkinBackground">
        {console.log(today)}
        <div className="contentWrapper">
          <div className="title">
            <h1><b>Check</b> In</h1>
            <button onClick={()=>this.props.toggle()}><h1>X</h1></button>
          </div>
          <form onSubmit={this.handleSubmit}>
            <div className="dateWrapper">
              <label for="checkInDate">This check-in is for:</label>
              <input type="date" id="checkInDate" name="Check-in Date"
                   value={today}
                   min="2018-01-01" max={today}/>
            </div>
            <p>All questions are optional, but remember – <b>an effective bubble is
            built on honesty and communication!</b></p>

            <hr/>

            <h3>On this date, did you...</h3>

            <div>
              <input
                onClick={(e)=>this.setState({socialized: !this.state.socialized})}
                type="checkbox" id="socialized" name="socialized"/>
              <label for="socialized">Socialize with people outside the bubble?</label>
            </div>

            { this.state.socialized &&
              <div className="followup">
                <p>While socializing, were you:</p>
                  <div>
                    <input
                      onClick={(e)=>this.setState({indoors: !this.state.indoors})}
                      type="checkbox" id="indoors" name="indoors"/>
                    <label for="indoors">Indoors?</label>
                  </div>

                  <div>
                    <input
                      onClick={(e)=>this.setState({unmasked: !this.state.unmasked})}
                      type="checkbox" id="unmasked" name="unmasked" />
                    <label for="unmasked">Unmasked?</label>
                  </div>

                  <div>
                    <input
                      onClick={(e)=>this.setState({notDistant: !this.state.notDistant})}
                      type="checkbox" id="notDistant" name="notDistant" />
                    <label for="notDistant">Closer than 6 feet apart?</label>
                  </div>
              </div>
            }

            <div>
              <input
                onClick={(e)=>this.setState({travel: !this.state.travel})}
                type="checkbox" id="travel" name="travel"/>
              <label for="travel">Travel outside your city / town / immediate area?</label>
            </div>

            { this.state.travel &&
              <div className="followup">
                <p>Was it an overnight stay?</p>

                <div>
                  <input type="radio" id="yes" name="overnight" value="yes"
                    onClick={(e)=>this.setState({overnight: true})}/>
                  <label for="yes">Yes</label>
                </div>

                <div>
                  <input type="radio" id="no" name="overnight" value="no"
                    onClick={(e)=>this.setState({overnight: false})}/>
                  <label for="no">No</label>
                </div>
              </div>
            }

            <div>
              <input
                onClick={(e)=>this.setState({travel: !this.state.publicTransport})}
                type="checkbox" id="publicTransport" name="publicTransport"/>
              <label for="publicTransport">Use public transportation,
              such as a plane, bus, or subway?</label>
            </div>

            <div>
              <input
                onClick={(e)=>this.setState({travel: !this.state.publicSpace})}
                type="checkbox" id="publicSpace" name="publicSpace"/>
              <label for="publicSpace">Eat inside a restaurant or otherwise
              spend more than  15 minutes unmasked in a public space?</label>
            </div>

            <div>
              <input
                onClick={(e)=>this.setState({tested: !this.state.tested})}
                type="checkbox" id="tested" name="tested"/>
              <label for="tested">Get tested for Covid-19?</label>
            </div>

            { this.state.tested &&
              <div className="followup">
                <p>Have you received your results yet?</p>

                <div>
                  <input type="radio" id="positive" name="results" value="positive"
                    onClick={(e)=>this.setState({testResults: 'positive'})}/>
                  <label for="positive">I tested <b>positive</b> for Covid-19</label>
                </div>

                <div>
                  <input type="radio" id="negative" name="results" value="negative"
                    onClick={(e)=>this.setState({testResults: 'negative'})}/>
                  <label for="negative">I tested <b>negative</b> for Covid-19</label>
                </div>

                <div>
                  <input type="radio" id="unknown" name="results" value="unknown"
                    onClick={(e)=>this.setState({testResults: 'unknown'})}/>
                  <label for="unknown">I do not have my results yet</label>
                </div>
              </div>
            }

            <div>
              <input
                onClick={(e)=>this.setState({contactPositive: !this.state.contactPositive})}
                type="checkbox" id="contactPositive" name="contactPositive"/>
              <label for="contactPositive">Hear that someone you’ve been in regular contact
              with tested positive for Covid-19? </label>
            </div>

            <div>
              <input
                onClick={(e)=>this.setState({symptoms: !this.state.symptoms})}
                type="checkbox" id="symptoms" name="symptoms"/>
              <label for="symptoms">Personally experience any symptoms
              suspicious of Covid-19? </label>
            </div>

            <div>
              <input
                onClick={(e)=>this.setState({quarantining: !this.state.quarantining})}
                type="checkbox" id="quarantining" name="quarantining"/>
              <label for="quarantining">Start or continue a quarantine? </label>
            </div>

            { this.state.quarantining &&
              <div className="followup">
                <p>Does your quarantine have a defined end date?</p>

                <div>
                  <input type="radio" id="yes" name="quarantineEnd" value="yes"/>
                  <label for="yes">Yes, my quarantine will end on
                    <label for="endDate"></label>
                    <input type="date" id="endDate" name="Quarantine end date"
                    onChange={this.updateEndDate}/>
                  </label>
                </div>

                <div>
                  <input type="radio" id="no" name="quarantineEnd" value="no"
                    onClick={(e)=>this.setState({quarantineEnd: ''})}/>
                  <label for="no">No, I’m not sure how long I’ll be quarantining</label>
                </div>
              </div>
            }

            <hr/>

            <h3>Do you have a status update or message to add to your check-in?</h3>
            <textarea onChange={this.updateStatus} maxlength="300" id="status" name="status"></textarea>

            <Button type="submit">Share with my bubble</Button>
          </form>
        </div>
      </div>
    );
  }

}
