import './App.css';
import firebase from 'firebase/app'
import React from 'react';
import Accordion from './components/accordion'

export default class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = { items: [], text: '', speed: 10 };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {

    let userData = {
      name: "Kathryn",
      lastCheckIn: "2020-10-31"
    }

    let bubbleData = {
      name: "The Squad",
      members: [
        {
          name: 'Adam',
          isQuarantining: [false, null],
          status: "Having a great time!",
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
              content={
                <>
                  { member.status &&
                    <>
                    <p>Status:</p>
                    <div>{member.status}</div>
                    </>
                  }
                  {member.checkIn && mapOverCheckIn(member.checkIn)}
                </>
              }
            />
          ))}
        </>
      )
    }

    function mapOverCheckIn(checkIn){
      return (
        <>
        {console.log("sup", checkIn)}
        {checkIn && checkIn.map(question => (
          <>
            { question.answer &&
              <p>{question.question}: {question.date}</p>
            }
          </>
        ))}
        </>
      )
    }

    return (
      <div className="background">
        <div className="contentWrapper">
          <h1>Welcome back, [name]</h1>
          <div className="checkIn">
            <p>Your last check-in was [date]</p>
            <button>Check-in</button>
          </div>
          <div className="bubble">
            <div className="bubbleName">
              <h2>{bubbleData.name}</h2>
              <p>settings</p>
            </div>
            <p>{bubbleData.members.length} members • Bubble rules</p>
            <div className="members">
              {mapOverMembers(bubbleData.members)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  handleChange(e) {
    this.setState({ text: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.text.length === 0) {
      return;
    }
    const newItem = {
      text: this.state.text,
      id: Date.now()
    };
    this.setState(state => ({
      items: state.items.concat(newItem),
      text: ''
    }));
  }
}
