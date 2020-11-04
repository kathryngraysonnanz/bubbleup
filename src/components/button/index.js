import React from "react";

import "./button.css";

function Button(props) {
  return (
    <button className="prettyButton">{props.children}</button>
  );
}

export default Button;
