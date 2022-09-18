import './App.css';
import React from 'react';
import NavigationBar from './components/navigation/NavigationBar';
import { Outlet } from 'react-router-dom';
import Header from './components/header/Header';

function App(props) {
  return (
    <div className="App">
      <Header />
      <NavigationBar />
      <Outlet />
    </div>
  );
}

export default App;