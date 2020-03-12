import React, { useState } from 'react'
import { useSelector } from 'react-redux';

import Button from "../button/button";
import Backdrop from "../backdrop/backdrop";
import "./modal.css";

export default function Modal(props) {
    const [messageContent, setMessageContent] = useState("");
    const token = useSelector(state => {return state.auth.token});
    const [showSeccessAlert,setSuccessAlert] = useState(false);

    const onSumbitHandler = (event) => {
        event.preventDefault();
        fetch('http://localhost:8080/messages/add-message',{
            method:'POST',
            body:JSON.stringify({content:messageContent}),
            headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`}
        })
        .then(res => {
            return res.json();
        })
        .then(response => { 
            setSuccessAlert(true);
            props.reloadPage();
        })
        .catch(err => {
            console.log(err);
        })
    }

    return (
        <React.Fragment>
            <Backdrop opened={props.opened} clicked={props.closed}></Backdrop>
            <div className='modal' style={{transform:props.opened?'translateY(0)':'translateY(-250%)'}}>
                {showSeccessAlert?<p className="seccessAlert">Message created Successfully, please close the modal or add another message as you like.</p>:null}
                <form onSubmit={onSumbitHandler}>
                    <label>Add Your Message</label>
                    <textarea onChange={(event) => setMessageContent(event.target.value)}></textarea>
                    <Button type="submit" >Add Message</Button>
                    <Button btnType="cancel" type="button" Clicked={props.closed}>Cancel</Button>
                </form>
            </div>
        </React.Fragment>
    )
}
