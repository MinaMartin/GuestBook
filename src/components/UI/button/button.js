import React from 'react';
import "./button.css";

export default function button(props) {

    let classes =["button"];
    classes.push(props.btnType);
    classes = classes.join(" ");
    return (
        <button 
        className={classes} 
        onClick={props.Clicked} 
        type={props.type}
        disabled={props.disabled}>{props.children}</button>
    )
}
