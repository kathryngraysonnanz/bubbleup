import React, { useState, useRef } from "react";
import Chevron from "./Chevron";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarCheck, faHouseUser } from '@fortawesome/free-solid-svg-icons'

import "./accordion.css";

function Accordion(props) {
  const [setActive, setActiveState] = useState("");
  const [setHeight, setHeightState] = useState("0px");
  const [setRotate, setRotateState] = useState("icon");

  const content = useRef(null);

  function toggleAccordion() {
    setActiveState(setActive === "" ? "active" : "");
    setHeightState(
      setActive === "active" ? "0px" : `${content.current.scrollHeight}px`
    );
    setRotateState(
      setActive === "active" ? "icon" : "icon rotate"
    );
  }

  return (
    <div className="section">
      <button className={`accordion ${setActive}`} onClick={toggleAccordion}>
        <div className="name">
          <Chevron className={`${setRotate}`} width={8} fill={"#777"} />
          <p className="accordionTitle">{props.title}</p>
          { props.isQuarantining == true &&
            <div className="quarantineAlert">
              <p>Quarantined</p>
              <FontAwesomeIcon icon={faHouseUser} />
            </div>
          }
        </div>
        <div>
          <p>Last check-in:</p>
          <p><FontAwesomeIcon icon={faCalendarCheck} /> {props.lastCheckIn}</p>
        </div>
      </button>
      <div
        ref={content}
        style={{ maxHeight: `${setHeight}` }}
        className="content"
      >
        <div>{props.content}</div>
      </div>
    </div>
  );
}

export default Accordion;
