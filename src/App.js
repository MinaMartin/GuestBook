import React, { useEffect } from 'react';
/* import logo from './logo.svg'; */
import './App.css';
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEdit, faTrash, faReply } from '@fortawesome/free-solid-svg-icons';
import { BrowserRouter } from 'react-router-dom';
import Container from './components/Container/Container';
import { useDispatch } from 'react-redux';
import * as authActionTypes from "./store/actions/auth";


library.add(faEdit, faTrash, faReply);

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authActionTypes.checkLoginOrNot())
  }, [dispatch])

  return (
    <React.Fragment >
      <BrowserRouter >
        <Header > </Header>
        <div className="App" >
          <Container></Container>
        </div>
      </BrowserRouter>
      <Footer > </Footer>
    </React.Fragment>
  );
}

export default App;