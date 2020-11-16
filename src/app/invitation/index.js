import React from "react";
import {Link} from "react-router-dom";

import { db } from "../services/firebase"

import Button from '../components/button'
import './invitation.css';

export default class Invite extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      name: "hold"
    }
  }

  componentDidMount(){

    let bubbleID = this.props.bubbleID

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
                <p><b>NOTE:</b> You cannot be in two bubbles at once. Clicking
                "Join" will be remove you from your current bubble and
                add you to this new bubble.</p>
                <div>
                  <Link to="/" onClick={()=>this.props.declineInvite()}>Decline invitation</Link>
                  <Link to="/" onClick={()=>this.props.acceptInvite()}><Button>Join</Button></Link>
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
