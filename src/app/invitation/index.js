import React from "react";

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

    let uuid

    db.ref('bubbles').orderByChild('link').equalTo(this.props.inviteURL).on("value", snapshot => {
        let referencedBubble = snapshot.val()

        if (referencedBubble) {
          uuid = Object.keys(referencedBubble)[0]
        } else {
          uuid = false
        }

        this.setState ({
          bubbleID: uuid,
          name: referencedBubble.[uuid].name
        })
    });
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
                <br/>
                <p><b>NOTE:</b> You cannot be in multiple bubbles at once. Clicking
                "Join" will be remove you from any current bubble you're a member
                of, and add you to this new bubble instead.</p>
                <div>
                  <a href="/" onClick={()=>this.props.declineInvite()}>Decline invitation</a>
                  <a href='/' onClick={()=>this.props.acceptInvite(this.state.bubbleID)}><Button>Join</Button></a>
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
