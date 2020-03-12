import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from "../../UI/button/button";
import "./message.css";

export default function Message(props) {
    const [toggleReplies, setTogglereplies] = useState(false);
    const [message, setMessage] = useState(props.content);
    const [reply, setReply] = useState('');
    const [editing, setEditing] = useState(false);

    const token = useSelector(state => {return state.auth.token});

    const toggleRepliesHandler = () => {
        setTogglereplies(prevState => {
            return !prevState;
        })
    }

    let repliesClasses = ['replies'];
    let oneReplyClasses = ['one-reply'];

    if (toggleReplies) {
        repliesClasses.push('hide');
        oneReplyClasses.push('hide');
    }
    repliesClasses = repliesClasses.join(' ');
    oneReplyClasses = oneReplyClasses.join(' ');

    const addReplayHandler = (event) => {
        toggleRepliesHandler();
        event.preventDefault();
        fetch(`http://localhost:8080/messages/${props._id}/add-reply`,{
            method:'PATCH',
            body:JSON.stringify({reply:reply}),
            headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`},
        })
        .then(res => {
            return res.json();
        })
        .then(response => {
            props.reloadPage();
            //console.log(response);
        })
        .catch(err => {
            console.log(err);
        })
    }

    const editingHandler = () => {
        setEditing(prevState => {
            return !prevState
        })
    }

    const EditReplayHandler = (event) => {
        event.preventDefault();
        editingHandler();
        fetch(`http://localhost:8080/messages/edit-message/${props._id}`,{
            method:'PATCH',
            body:JSON.stringify({content:message}),
            headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`}
        })
        .then(res => {
            return res.json();
        })
        .then(res => {
            props.reloadPage();
            //console.log(res);
        })
        .catch(err => {
            console.log(err);
        })
    }

    const deleteHandler = () => {
        fetch(`http://localhost:8080/messages/delete-message/${props._id}`,{
            method:'DELETE',
            headers:{'Authorization':`Bearer ${token}`}
        })
        .then(res => {
            return res.json();
        })
        .then(res => {
            props.reloadPage();
            //console.log(res);
        })
        .catch(err => {
            console.log(err);
        })
    }

    return (
        <div className='message'>
            <div className="creator">
                <h3>By {props.creator}</h3>
                <h4>On {props.messageDate}</h4>
            </div>
            <div className="content">
                {editing ? (
                    <form onSubmit={EditReplayHandler}>
                        <input
                            type="text"
                            value={message}
                            onChange={(event) => setMessage(event.target.value)}></input>
                        <div style={{ 'textAlign': 'right' }}>
                            <Button btnType="edit" type="submit">Edit the message</Button>
                        </div>
                    </form>
                ) : (<p>{props.content}</p>)}
            </div>
            <div className="config">
                <span>
                    <Button btnType="alert" Clicked={toggleRepliesHandler}>{props.replies.length} <FontAwesomeIcon icon="reply"></FontAwesomeIcon></Button>
                </span>
                <span>
                    <Button Clicked={toggleRepliesHandler}>Reply</Button>
                    {props.showEditAnddelete?
                    (<span><Button btnType="edit" Clicked={editingHandler}>Edit <FontAwesomeIcon icon="edit"></FontAwesomeIcon></Button>
                    <Button btnType="cancel" Clicked={deleteHandler}><FontAwesomeIcon icon="trash"></FontAwesomeIcon></Button></span>):null}
                </span>
            </div>
            {
                toggleReplies ? (
                    <div className={repliesClasses}>
                        {props.replies.map(reply => (
                            <div className="one-reply" key={reply.reply}>
                                {reply.reply}
                                <p style={{ "textAlign": "right", "color": "grey" }}>By {reply.userName}</p>
                            </div>
                        ))}
                        <form onSubmit={addReplayHandler}>
                            <input type="text" onChange={(event) => setReply(event.target.value)}></input>
                            <div style={{ 'textAlign': 'right' }}>
                                <Button btnType="cancel" type="submit">Add A reply</Button>
                            </div>
                        </form>
                    </div>
                ) : null
            }
            {/*             <div className={repliesClasses}>
                {props.replies.map(reply => (
                    <p className="one-reply">
                        {reply.reply}
                        <p style={{ "textAlign": "right", "color": "grey" }}>By {reply.userName}</p>
                    </p>
                ))}
            </div> */}
        </div>
    )
}
