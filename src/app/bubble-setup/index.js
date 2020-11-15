import React from "react";

import firebase from 'firebase/app'
import { auth } from "../services/firebase";
import { db } from "../services/firebase"

import Button from '../components/button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import './bubble-setup.css';

export default class BubbleSetup extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: auth().currentUser,
      readError: null,
      writeError: null,

      bubbleName: 'My Bubble',
      invites: '',
      bubbleUUID: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleBubbleCreation = this.handleBubbleCreation.bind(this);
  }

  copyToClipboard = (e) => {
    e.preventDefault();
    this.textArea.select();
    document.execCommand('copy');
    e.target.focus();
    this.setState({ copySuccess: true });
  };

  writeBubbleData(bubbleName, bubbleUUID, invites) {
    let user = firebase.auth().currentUser.uid

    db.ref('bubbles/' + bubbleUUID).set({
      name: bubbleName
    });

    db.ref('bubbles/' + bubbleUUID + '/members/' + user).update({
      name: this.props.username,
      admin: true
    })

    db.ref('users/' + user).update({
      bubble: bubbleUUID,
      admin: true
    });

    this.props.toggle()
  }

  async handleBubbleCreation(event) {
    event.preventDefault();
    this.setState({ error: '' });
    try {
      await this.writeBubbleData(
        this.state.bubbleName,
        this.state.bubbleUUID,
        this.state.invites
      )
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  componentDidMount() {
    function uuidv4() {
      return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (((c ^ crypto.getRandomValues(new Uint8Array(1))[0]) & 15) >> c / 4).toString(16)
      );
    }
    this.setState({ bubbleUUID: uuidv4() })
  }

  render() {

    // TODO: Replace localhost

    let inviteURL = "http://localhost:3000/"+this.state.bubbleUUID

    return (
      <div className="overlayBackground">
        <div className="contentWrapper bubbleSettings">
          <div className="title">
            <h1>Start a new <b>Bubble</b></h1>
            <button onClick={()=>this.props.toggle()}><h1>X</h1></button>
          </div>
          <form onSubmit={this.handleBubbleCreation}>
            <h3>Bubble Name</h3>
            <p>Bubble names are optional and just for fun. We’ll use the name
            “My Bubble” if nothing is provided. <b>You can update this name
            from the Bubble Settings page later.</b></p>

            <input onChange={this.handleChange} type="text" maxLength="60"
            id="bubbleName" name="bubbleName"/>

            <h3>Invite Members</h3>
            <p>Your bubble should be a small, tight-knit group of people that all
            interact regularly. All members of the bubble will be able
            to see each others' check-in information.</p>
            <p>This is your bubble's secret link! <b>Anyone with this link can
            join your bubble</b>, so don't share it on any public forums or social
            media sites! Give it directly to the people you want to invite.</p>
            <div className="inviteURLWrapper">
              <textarea
                ref={(textarea) => this.textArea = textarea}
                value={inviteURL}
                id="inviteURL" name="inviteURL">
              </textarea>
              { document.queryCommandSupported('copy') &&
                <div className="copyButton">
                  <Button onClick={this.copyToClipboard}>
                    { this.state.copySuccess &&
                      <>Copied! <span> <FontAwesomeIcon icon={faCheckCircle}/></span></>
                    }
                    { !this.state.copySuccess &&
                      <>Copy</>
                    }
                  </Button>
                </div>
              }
            </div>

            <Button type="submit"> <FontAwesomeIcon icon={faCheckCircle} /> Create Bubble</Button>
          </form>
        </div>
      </div>
    );
  }

}
