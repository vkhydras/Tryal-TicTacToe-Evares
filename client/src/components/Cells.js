import React from "react";

function Cells(props) {

  let winningCells = props.winningCells
  let classN = winningCells.includes(props.id) ?"cell winning-row":"cell"

  return (
    <div>
        <div 
        className={!props.clicked?"NotClickedcell cell":classN} 
        id={props.id} 
        onClick = {() => props.cellClick(props.id)}
        >
          {props.value}
          </div>
    </div>
  );
}

export default Cells;
