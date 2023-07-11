import React from "react";

function TurnIndicator(props) {
  const styles ={
    backgroundColor:props.turn &&!props.gameOver&&"#FF2E63"
  }
  const styles1 ={
    backgroundColor:!props.turn && !props.gameOver &&"#FF2E63"
  }
  const styleBold = {
    fontWeight: "bolder"
  }

  return (
    < div className="turnIndicator">
      {!props.win && !props.draw ?<div id="turn" style={styleBold}>{props.turn ? "X":"O"}'S TURN</div>
      :<div id="turn" className={props.win &&"winning-message"} style={styleBold}>
         {props.win && <span>{props.gameOver ? "😀"+props.winner +" ":""}</span>}
         {props.draw &&!props.win ? "😥 DRAW":"WON"}
         </div>}
      <div className="turnContainer">
        <div id="X" className="turnBox" style={styles}>X</div>
        <div id="O" className="turnBox" style={styles1}>O</div>
      </div>
    </div>
  );
}

export default TurnIndicator;
