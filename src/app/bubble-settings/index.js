import React from "react";
import {Link} from "react-router-dom";

import { auth } from "../services/firebase";
import { db } from "../services/firebase"

import Button from '../components/button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSignOutAlt,
  faUserCog,
  faCheckCircle,
  faUserPlus,
  faUserCheck,
  faUserTimes } from '@fortawesome/free-solid-svg-icons'
import './bubble-settings.css';

export default class BubbleSettings extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: auth().currentUser,
      readError: null,
      writeError: null,
      invites: '',
      authUpdate: false,
      memberToRemove: false
    };

    this.renderMemberEditRows = this.renderMemberEditRows.bind(this)
    this.renderPendingMemberEditRows = this.renderPendingMemberEditRows.bind(this)
    this.showModal = this.showModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.promote = this.promote.bind(this);
    this.approve = this.approve.bind(this);
    this.decline = this.decline.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.generateNewURL = this.generateNewURL.bind(this);
  }

  copyToClipboard = (e) => {
    e.preventDefault();
    this.textArea.select();
    document.execCommand('copy');
    e.target.focus();
    this.setState({ copySuccess: true });
  };

  componentDidMount() {
    if (this.props.location.state !== undefined) {
      this.setState({
        members: this.props.location.state.members,
        pendingMembers: this.props.location.state.pendingMembers,
        bubbleName: this.props.location.state.name,
        bubbleId: this.props.location.state.bubbleId,
        link: this.props.location.state.link
      })
    }
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ writeError: null });

    try {
      await db.ref('bubbles/' + this.state.bubbleId).update({
        name: this.state.bubbleName
      });
    } catch (error) {
      this.setState({ writeError: error.message });
    }

    this.props.history.push('/');
  }

  updateMembers(){

    db.ref("/bubbles/" + this.state.bubbleId).on("value", snapshot => {
      let members = (snapshot.val() && snapshot.val().members) || null;
      let pendingMembers = (snapshot.val() && snapshot.val().pendingMembers) || null;

        this.setState ({
          members: members,
          pendingMembers: pendingMembers
        });

    });
  }

  approve(memberId, memberName){
    try {
      db.ref('users/' + memberId).update({
        pendingBubble: false,
        bubble: this.state.bubbleId
      });

      db.ref('bubbles/' + this.state.bubbleId + '/members/' + memberId).update({
        name: memberName
      });

      db.ref('bubbles/' + this.state.bubbleId + '/pendingMembers/' + memberId).remove();

      this.updateMembers();
    } catch {
      console.log('error approving')
    }
  }

  decline(memberId) {
    try {
      db.ref('users/' + memberId).update({
        pendingBubble: false
      });

      db.ref('bubbles/' + this.state.bubbleId + '/pendingMembers/' + memberId).remove();
      this.updateMembers();
    } catch {
      console.log("error declining")
    }
  }

  promote(memberId, bubbleId) {
    try {
      db.ref('users/' + memberId).update({
        admin: true
      });
      db.ref('bubbles/' + bubbleId + '/members/' + memberId).update({
        admin: true
      });
      this.updateMembers();
    } catch (error) {
      console.log('error')
    }
  }

  remove(memberId, bubbleId) {
    try {
      db.ref('users/' + memberId).update({
        bubble: false,
        admin: false,
        removed: true
      });
      db.ref('bubbles/' + bubbleId + '/members/' + memberId).remove();
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

  modal(member, bubbleId){
    return (
      <div className="modalWrapper">
        <div className="modal">
          <h3>Are you sure you want to remove this user from the bubble?</h3>
          <p>Removed members must be reinvited in order
          to rejoin. Removing a member removes all their
          previously shared data from the bubble.</p>
          <div>
            <Button onClick={()=>this.showModal()}>Nevermind</Button>
            <Button onClick={()=>this.remove(member, bubbleId)}>Yes, remove</Button>
          </div>
        </div>
      </div>
    )
  }

  renderMemberEditRows(members, promote, showModal, bubbleId){
    return (
      <>
        { this.state.showModal &&
          this.modal(this.state.memberToRemove, bubbleId)
        }
        {Object.entries(members).map(member =>
          <tr key={member[1].name}>
            <td>{member[1].name} { this.state.user.uid === member[0] && <span> (You)</span> }</td>
            <td>
              { member[1].admin &&
                <><FontAwesomeIcon icon={faUserCog} /> Admin</>
              }
              { !member[1].admin &&
                <button onClick={(e) => promote(member[0], bubbleId)}>
                  <FontAwesomeIcon icon={faUserPlus} /> <span>Promote to admin</span>
                </button>
              }
            </td>

            <td>
              { this.state.user.uid !== member[0] &&
                <button onClick={(e) => showModal(member[0], bubbleId)}>
                  <FontAwesomeIcon icon={faSignOutAlt} /> <span>Remove from bubble</span>
                </button>
              }
              { this.state.user.uid === member[0] &&
                <>Edit your membership in <Link to="/user-settings">User Settings</Link></>
              }
            </td>

          </tr>
        )}
      </>
    )
  }

  renderPendingMemberEditRows(pendingMembers, approve, decline, bubbleId){
    return (
      <>
        {Object.entries(pendingMembers).map(member =>
          <tr key={member[1].name}>
            <td>{member[1].name}</td>
            <td>
              <button onClick={(e) => approve(member[0], member[1].name)}>
                <FontAwesomeIcon icon={faUserCheck} /> <span>Approve</span>
              </button>
            </td>

            <td>
              <button onClick={(e) => decline(member[0])}>
                <FontAwesomeIcon icon={faUserTimes} /> <span>Decline</span>
              </button>
            </td>
          </tr>
        )}
      </>
    )
  }

  uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (((c ^ crypto.getRandomValues(new Uint8Array(1))[0]) & 15) >> c / 4).toString(16)
    );
  }

  generateNewURL(e) {
    e.preventDefault();

    let newUUID = this.uuidv4()

    this.setState({ link: newUUID });

    db.ref('bubbles/' + this.props.location.state.bubbleId ).update({
      link: newUUID
    });
  }

  render() {

    if (this.props.location.state === undefined) {
      this.props.history.push('/');
    }

    let inviteURL

    if (window.location.hostname === "localhost") {
      inviteURL = "http://localhost:3000/"+this.state.link
    } else {
      inviteURL = window.location.hostname+"/"+this.state.link
    }

    return (
      <div className="overlayBackground">
        <div className="contentWrapper bubbleSettings">
          <div className="title">
            <h1><b>Bubble</b> Settings</h1>
            <Link to='/'><h1>X</h1></Link>
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
                {this.state.members && this.renderMemberEditRows(this.state.members, this.promote, this.showModal, this.state.bubbleId)}
                </tbody>
              </table>

          </div>

          <div className="editBubbleMembers">
            <h3>Pending Bubble Members</h3>
            <p><b>These are people who have followed your invitation link and
            asked to join your bubble.</b></p>
            <p>Only admins can approve new bubble members. If you find your bubble
            getting a large number of unknown applicants, generate a new bubble
            invitation link below.</p>


              <table>
                <tbody>
                {this.state.pendingMembers && this.renderPendingMemberEditRows(this.state.pendingMembers, this.approve, this.decline, this.state.bubbleId)}
                </tbody>
              </table>

          </div>

          <form onSubmit={this.handleSubmit}>
            <h3>Bubble Name</h3>
            <p>Bubble names are optional and just for fun. Currently, your bubble's name
            is <b>{this.state.bubbleName}</b>. </p>

            <input onChange={this.handleChange} type="text" maxLength="60"
            id="bubbleName" name="bubbleName"/>

            <h3>Invite Members</h3>
            <p>Your bubble should be a small, tight-knit group of people that all
            interact regularly. All members of the bubble will be able
            to see each others' check-in information.</p>
            <p>This is your bubble's secret link! <b>Anyone with this link can apply to
            join your bubble</b>, so don't share it on any public forums or social
            media sites. Give it directly to the people you want to invite.</p>
            <div className="inviteURLWrapper">
              <textarea
                ref={(textarea) => this.textArea = textarea}
                value={inviteURL}
                id="inviteURL" name="inviteURL">
              </textarea>
              <Button onClick={this.generateNewURL}>Generate a new link</Button>
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

            <div className="submitButton">
              <Button type="submit"> <FontAwesomeIcon icon={faCheckCircle} /> Save changes</Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

}
