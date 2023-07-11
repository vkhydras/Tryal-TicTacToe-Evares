import React from "react";


function RstButton(props) {
  const marginRight = {
    margin: "8px"
  }
  return (
    <button id="restart" onClick={props.restart} style={marginRight}>
      {props.gameOver? "NEW GAME" : "RESTART"}
    </button>
  );
}

export default RstButton;
