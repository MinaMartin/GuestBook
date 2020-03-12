import React from 'react'
import "./backdrop.css";

export default function Backdrop(props) {

    return (
        props.opened?(<div className='backdrop' onClick={props.clicked}></div>):null
    )
}
