import React from 'react'
import { Route } from 'react-router';
import Messages from "../messages/messages";
import Auth from "../auth/auth";


export default function Container() {
  return (
    <div >
      <Route path='/' exact component={Messages}></Route>
      <Route path='/auth' exact component={Auth}></Route>
    </div>
  )
}