import React from "react";

import { auth } from "../services/firebase";
import { db } from "../services/firebase"

import Button from '../components/button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt, faUserCog, faCheckCircle, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import './bubble-settings.css';

export default class BubbleSettings extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: auth().currentUser,
      readError: null,
      writeError: null,
      invites: '',
      members: this.props.members,
      bubbleName: this.props.name,
      authUpdate: false,
      memberToRemove: false
    };

    this.renderMemberEditRows = this.renderMemberEditRows.bind(this)
    this.showModal = this.showModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.promote = this.promote.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  copyToClipboard = (e) => {
    e.preventDefault();
    this.textArea.select();
    document.execCommand('copy');
    e.target.focus();
    this.setState({ copySuccess: true });
  };

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ writeError: null });

    try {
      await db.ref('bubbles/' + this.props.bubbleId).update({
        name: this.state.bubbleName
      });
    } catch (error) {
      this.setState({ writeError: error.message });
    }
    this.props.toggle()
  }

  updateMembers(){
    db.ref("/bubbles/" + this.props.bubbleId).on("value", snapshot => {
      var members = (snapshot.val() && snapshot.val().members) || null;
      this.setState ({
        members: members
      });
    });
  }

  promote(memberId) {
    try {
      db.ref('users/' + memberId).update({
        admin: true
      });
      db.ref('bubbles/' + this.props.bubbleId + '/members/' + memberId).update({
        admin: true
      });
      this.updateMembers();
    } catch (error) {
      console.log('error')
    }
  }

  remove(memberId) {
    try {
      db.ref('users/' + memberId).update({
        bubble: false
      });
      db.ref('bubbles/' + this.props.bubbleId + '/members/' + memberId).remove();
      this.updateMembers();
    } catch (error) {
      console.log('error')
    }
    this.showModal();
  }

  showModal(member){
    this.setState({
      showModal: !this.state.showModal,
      memberToRemove: member
    })
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  modal(member){
    return (
      <div className="modalWrapper">
        <div className="modal">
          <h3>Are you sure you want to remove this user from the bubble?</h3>
          <p>Removed members must be reinvited in order
          to rejoin. Removing a member removes all their
          previously shared data from the bubble.</p>
          <div>
            <Button onClick={()=>this.showModal()}>Nevermind</Button>
            <Button onClick={()=>this.remove(member)}>Yes, remove</Button>
          </div>
        </div>
      </div>
    )
  }

  renderMemberEditRows(members, promote, showModal){
    return (
      <>
        { this.state.showModal &&
          this.modal(this.state.memberToRemove)
        }
        {Object.entries(members).map(member =>
          <tr key={member[1].name}>
            <td>{member[1].name}</td>
            <td>
              { member[1].admin &&
                <><FontAwesomeIcon icon={faUserCog} /> Admin</>
              }
              { !member[1].admin &&
                <button onClick={(e) => promote(member[0])}>
                  <FontAwesomeIcon icon={faUserPlus} /> <span>Promote to admin</span>
                </button>
              }
            </td>
            <td><button onClick={(e) => showModal(member[0])}>
              <FontAwesomeIcon icon={faSignOutAlt} /> <span>Remove from bubble</span>
            </button></td>
          </tr>
        )}
      </>
    )
  }

  render() {

    let inviteURL = window.location.href+this.props.bubbleId

    return (
      <div className="overlayBackground">
        <div className="contentWrapper bubbleSettings">
          <div className="title">
            <h1><b>Bubble</b> Settings</h1>
            <button onClick={()=>this.props.toggle()}><h1>X</h1></button>
          </div>
          <div className="editBubbleMembers">
            <h3>Bubble Members</h3>
            <p><b>Everyone listed here can see the data shared by users within the
            bubble.</b></p>
            <p>Only admins can change bubble settings, including
            promoting members to admin and removing members.
            Once a member is promoted to admin, they cannot be demoted. There is no
            limit to the number of admin users in a bubble.</p>

            <table>
              <tbody>
              {this.renderMemberEditRows(this.state.members, this.promote, this.showModal)}
              </tbody>
            </table>
          </div>
          <form onSubmit={this.handleSubmit}>
            <h3>Bubble Name</h3>
            <p>Bubble names are optional and just for fun. Currently, your bubble's name
            is <b>{this.props.name}</b>. </p>

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

            <Button type="submit"> <FontAwesomeIcon icon={faCheckCircle} /> Save changes</Button>
          </form>
        </div>
      </div>
    );
  }

}
