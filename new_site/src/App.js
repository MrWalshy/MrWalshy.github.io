import './App.css';
import React from 'react';
import NavigationBar from './components/navigation/NavigationBar';
import { Outlet } from 'react-router-dom';

function App(props) {
  return (
    <div className="App">
      <NavigationBar />
      <Outlet />
    </div>
  );
}

export default App;