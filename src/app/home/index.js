import React, { Component } from "react";

import firebase from 'firebase/app'
import { auth } from "../services/firebase";
import { db } from "../services/firebase"

import Checkin from '../checkin'

import Accordion from '../components/accordion'
import Button from '../components/button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog, faUserCircle, faCalendarCheck } from '@fortawesome/free-solid-svg-icons'
import './home.css';

export default class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      checkinVisible: false,
      user: auth().currentUser,
      bubbles: [],
      readError: null,
      writeError: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.toggleCheckinVisibility = this.toggleCheckinVisibility.bind(this)
  }

  async componentDidMount() {
    this.setState({ readError: null });
    try {
      db.ref("bubbles").on("value", snapshot => {
        let bubbles = [];
        snapshot.forEach((snap) => {
          bubbles.push(snap.val());
        });
        this.setState({ bubbles });
      });
    } catch (error) {
      this.setState({ readError: error.message });
    }
  }

  handleChange(event) {
    this.setState({
      bubbles: event.target.value
    });
  }

  toggleCheckinVisibility() {
    this.setState({ checkinVisible: !this.state.checkinVisible });
  }


  render() {

    let userData = {
      name: "Kathryn",
      lastCheckIn: "2020-10-31",
      bubble: 'uuid',
      admin: true
    }

    let bubbleData = {
      uuid: 'uuid',
      name: "The Squad",
      rules: 'yep we have rules',
      members: [
        {
          name: 'Adam Zweisteisteinger Euralious',
          isQuarantining: [false, null],
          status: "Having a great time!",
          lastCheckIn: '2020-11-02',
          checkIn: [
            {
              question: "socialized",
              answer: true,
              details: {
                masked: true,
                distanced: false,
                outdoors: true,
              },
              date: '2020-10-31'
            },
            {
              question: "travel",
              answer: false,
              date: '2020-11-01'
            },
            {
              question: "public transport",
              answer: false,
              date: '2020-11-01'
            },
            {
              question: "inside",
              answer: true,
              date: '2020-11-01'
            },
            {
              question: "tested",
              answer: true,
              details: {
                results: "negative"
              },
              date: '2020-11-01'
            },
            {
              question: "contact with positive",
              answer: true,
              date: '2020-10-20'
            },
            {
              question: "symptoms",
              answer: false,
              date: '2020-11-01'
            }
          ]
        },
        {
          name: 'K',
          isQuarantining: [true, '2020-11-28'],
          status: '',
          lastCheckIn: '2020-11-01',
          checkIn: [
            {
              question: "socialized",
              answer: true,
              details: {
                masked: true,
                distanced: false,
                outdoors: true,
              },
              date: '2020-10-31'
            },
            {
              question: "travel",
              answer: false,
              date: '2020-11-01'
            },
            {
              question: "public transport",
              answer: false,
              date: '2020-11-01'
            },
            {
              question: "inside",
              answer: true,
              date: '2020-11-01'
            },
            {
              question: "tested",
              answer: true,
              details: {
                results: "negative"
              },
              date: '2020-11-01'
            },
            {
              question: "contact with positive",
              answer: true,
              date: '2020-10-20'
            },
            {
              question: "symptoms",
              answer: false,
              date: '2020-11-01'
            }
          ]
        }
      ]
    }

    function mapOverMembers(members){
      return (
        <>
          {members && members.map(member => (
            <Accordion
              title={member.name}
              isQuarantining={member.isQuarantining[0]}
              lastCheckIn={member.lastCheckIn}
              content={
                <>
                  { member.status &&
                    <div className="status">
                      <p>Status:</p>
                      <div>{member.status}</div>
                    </div>
                  }
                  {member.checkIn && mapOverCheckIn(member.checkIn)}
                </>
              }
            />
          ))}
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

    function mapOverCheckIn(checkIn){
      return (
        <div className="questionWrapper">
        {checkIn && checkIn.map(question => (
          <>
            { question.answer &&
              <div className="question">
                <div className="days">
                  <p>
                    {daysSince(question.date)}
                  </p>
                  <p>days</p>
                </div>
                <p>{question.question}</p>
              </div>
            }
          </>
        ))}
        </div>
      )
    }

    return (
      <div className="background">
        { this.state.checkinVisible && <Checkin toggle={this.toggleCheckinVisibility}/> }
        <div className="contentWrapper">
          <div className="welcome">
            <h1>Welcome back, <b>{userData.name}</b>&nbsp;<FontAwesomeIcon icon={faUserCircle} /></h1>
            <div>
              <p>Your last check-in was {userData.lastCheckIn}</p>
              <Button onClick={(e)=>this.toggleCheckinVisibility()}>
                <FontAwesomeIcon icon={faCalendarCheck} /> Check-in
              </Button>
            </div>
          </div>
          <div className="bubble">
            <div className="bubbleInfo">
              <div className="bubbleName">
                <h2>{bubbleData.name}</h2>
                <h2>{ userData.admin && <FontAwesomeIcon icon={faCog} /> }</h2>
              </div>
              <div className="bubbleDetails">
                <p>{bubbleData.members.length} members </p>
                { bubbleData.rules && <p> • Bubble rules</p> }
              </div>
            </div>
            <div className="members">
              {mapOverMembers(bubbleData.members)}
            </div>
          </div>
        </div>
      </div>
    );
  }

}
