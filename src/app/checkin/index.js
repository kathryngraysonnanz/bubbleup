import Reac from "react";

import firebase from 'firebase/app'
import { auth } from "../services/firebase";
import { db } from "../services/firebase"

import Button from '../components/button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarCheck } from '@fortawesome/free-solid-svg-icons'
import './checkin.css';

export default class Checkin extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: auth().currentUser,
      readError: null,
      writeError: null,

      checkInDate: new Date().toISOString().substring(0,10),

      socialized: false,
      indoors: false,
      unmasked: false,
      notDistant: false,

      travel: false,
      overnight: false,

      publicTransport: false,

      publicSpace: false,

      tested: false,
      testResults: false,

      contactPositive: false,

      symptoms: false,

      quarantining: false,
      quarantineEnd: false,

      status: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setTested = this.setTested.bind(this);
    this.setSocialized = this.setSocialized.bind(this);
    this.setTravel = this.setTravel.bind(this);
    this.setQuarantine = this.setQuarantine.bind(this);
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ writeError: null });

    try {

      db.ref('bubbles/' + this.props.bubble + '/members/' + firebase.auth().currentUser.uid).update({
        name: this.props.name,
        lastCheckIn: this.state.checkInDate
      });

      db.ref('users/' + firebase.auth().currentUser.uid ).update({
        lastCheckIn: this.state.checkInDate
      });

      if (this.state.socialized === true) {
        db.ref('bubbles/' + this.props.bubble + '/members/' + firebase.auth().currentUser.uid + '/checkin').update({
          socialized: [this.state.socialized, this.state.checkInDate],
          indoors: [this.state.indoors],
          unmasked: [this.state.unmasked],
          notDistant: [this.state.notDistant]
        });
      }

      if (this.state.travel === true) {
        db.ref('bubbles/' + this.props.bubble + '/members/' + firebase.auth().currentUser.uid + '/checkin').update({
          travel: [this.state.travel, this.state.checkInDate],
          overnight: [this.state.overnight]
        });
      }

      if (this.state.publicTransport === true) {
        db.ref('bubbles/' + this.props.bubble + '/members/' + firebase.auth().currentUser.uid + '/checkin').update({
          publicTransport: [this.state.publicTransport, this.state.checkInDate]
        });
      }

      if (this.state.publicSpace === true) {
        db.ref('bubbles/' + this.props.bubble + '/members/' + firebase.auth().currentUser.uid + '/checkin').update({
          publicSpace: [this.state.publicSpace, this.state.checkInDate]
        });
      }

      if (this.state.tested === true) {
        db.ref('bubbles/' + this.props.bubble + '/members/' + firebase.auth().currentUser.uid + '/checkin').update({
          tested: [this.state.tested, this.state.checkInDate],
          testResults: [this.state.testResults]
        });
      }

      if (this.state.contactPositive === true) {
        db.ref('bubbles/' + this.props.bubble + '/members/' + firebase.auth().currentUser.uid + '/checkin').update({
          contactPositive: [this.state.contactPositive, this.state.checkInDate]
        });
      }

      if (this.state.symptoms === true) {
        db.ref('bubbles/' + this.props.bubble + '/members/' + firebase.auth().currentUser.uid + '/checkin').update({
          symptoms: [this.state.symptoms, this.state.checkInDate]
        });
      }

      if (this.state.quarantining === true) {
        db.ref('bubbles/' + this.props.bubble + '/members/' + firebase.auth().currentUser.uid + '/checkin').update({
          quarantining: [this.state.quarantining, this.state.checkInDate],
          quarantineEnd: [this.state.quarantineEnd]
        });
      }

      db.ref('bubbles/' + this.props.bubble + '/members/' + firebase.auth().currentUser.uid + '/checkin').update({
        status: [this.state.status, this.state.checkInDate]
      });
    } catch (error) {
      this.setState({ writeError: error.message });
    }

    this.props.toggle()
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  setTested(event){
    if (event.target.checked === true) {
      this.setState({tested: true})
    } else {
      this.setState({tested: false})
      this.setState({testResults: false})
    }
  }

  setSocialized(event){
    if (event.target.checked === true) {
      this.setState({socialized: true})
    } else {
      this.setState({socialized: false})
      this.setState({indoors: false})
      this.setState({masked: false})
      this.setState({distanced: false})
    }
  }

  setTravel(event){
    if (event.target.checked === true) {
      this.setState({travel: true})
    } else {
      this.setState({travel: false})
      this.setState({overnight: false})
    }
  }

  setQuarantine(event){
    if (event.target.checked === true) {
      this.setState({quarantining: true})
    } else {
      this.setState({quarantining: false})
      this.setState({quarantineEnd: false})
    }
  }

  render() {

    let today = new Date().toISOString().substring(0,10);

    return (
      <div className="overlayBackground">
        <div className="contentWrapper">
          <div className="title">
            <h1><b>Check</b> In</h1>
            <button onClick={()=>this.props.toggle()}><h1>X</h1></button>
          </div>
          <form onSubmit={this.handleSubmit}>
            <div className="dateWrapper">
              <label for="checkInDate">This check-in is for:</label>
              <input type="date" id="checkInDate" name="checkInDate"
                 min="2018-01-01" max={today}
                   onChange={this.handleChange}/>
            </div>
            <p>All questions are optional, but remember – <b>an effective bubble is
            built on honesty and communication!</b></p>

            <hr/>

            <h3>On this date, did you...</h3>

            <div>
              <input
                onClick={this.setSocialized}
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
                onClick={this.setTravel}
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
                onClick={(e)=>this.setState({publicTransport: !this.state.publicTransport})}
                type="checkbox" id="publicTransport" name="publicTransport"/>
              <label for="publicTransport">Use public transportation,
              such as a plane, bus, or subway?</label>
            </div>

            <div>
              <input
                onClick={(e)=>this.setState({publicSpace: !this.state.publicSpace})}
                type="checkbox" id="publicSpace" name="publicSpace"/>
              <label for="publicSpace">Eat inside a restaurant or otherwise
              spend more than  15 minutes unmasked in a public space?</label>
            </div>

            <div>
              <input
                onClick={this.setTested}
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
                onClick={this.setQuarantine}
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
                    onChange={this.handleChange}/>
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
            <textarea onChange={this.handleChange} maxLength="300" id="status" name="status"></textarea>

            <Button type="submit"><FontAwesomeIcon icon={faCalendarCheck} /> Share with my bubble</Button>
          </form>
        </div>
      </div>
    );
  }

}
