import React from "react"

export default function ExitBtn(props) {
    const marginLeft = {
        margin: "8px"
    }
    return (
        <button id="exit" onClick={props.exit} style={marginLeft}>EXIT</button>
    )
}