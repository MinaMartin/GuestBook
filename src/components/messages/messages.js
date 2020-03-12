import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';

import Message from "./message/message";
import Button from "../UI/button/button";
import Modal from "../UI/modal/modal";
import Spinner from "../UI/spinner/spinner";
import "./messages.css";

export default function Messages() {
    const [toggleModal,setToggleModal] = useState(false);
    const [page,setPage] = useState(1);
    const [messages,setMessages] = useState([]);
    const [numberOfMessages,setNumberOfMessages]=useState(0);
    const [isLoading,setIsLoading] = useState(false);

    const token = useSelector(state => {return state.auth.token});
    const userId = useSelector(state => {return state.auth.userId});

    useEffect(() => {
        setIsLoading(true);
        fetch(`http://localhost:8080/messages?page=${page}`,{
            method:'GET',
            headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`}
        })
        .then(res => {
            return res.json();
        })
        .then(messages => {
            setIsLoading(false);
            setMessages(messages.messageCreated);
            setNumberOfMessages(messages.numberOfMessages);
        })
        .catch(err => {
            setIsLoading(false);
            console.log(err);
        })
    },[page,token]);

    const reloadPage = () => {
        setIsLoading(true);
        fetch(`http://localhost:8080/messages?page=${page}`,{
            method:'GET',
            headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`}
        })
        .then(res => {
            return res.json();
        })
        .then(messages => {
            setIsLoading(false);
            setMessages(messages.messageCreated);
            setNumberOfMessages(messages.numberOfMessages);
        })
        .catch(err => {
            setIsLoading(false);
            console.log(err);
        })
    }

    const addMessage = () => {
        setToggleModal(true);
    }

    const closeModal = () => {
        setToggleModal(false);
    }

    const increasePage = () => {
        setPage(prevState => {
            return prevState+1
        })
    }

    const decreasePage = () => {
        setPage(prevState => {
            if(prevState === 1){
                return 1;
            }
            return prevState-1
        })
    }

    let content = isLoading?(<div style={{'textAlign':'center'}}><Spinner></Spinner></div>):(
        messages.map(message => (
            <Message 
            creator={message.messageCreator} 
            content={message.content}
            key={message._id}
            _id={message._id}
            replies={message.replies}
            messageDate={message.messageDate}
            showEditAnddelete={message.userId === userId}
            reloadPage={reloadPage}></Message>
        ))
    );
    
    return (
    <div className="messages">
        <Modal opened={toggleModal} closed={closeModal} reloadPage={reloadPage}></Modal>
        <div className="addMessage">
            <Button Clicked={addMessage}>Add message</Button>
        </div>
            {content}
        <div className="pagination">
            <Button Clicked={decreasePage} disabled={page === 1?true:false}>Previous</Button>
            <Button Clicked={increasePage} disabled={numberOfMessages>5*page?false:true}>Next</Button>
        </div>
    </div>
    )
}
