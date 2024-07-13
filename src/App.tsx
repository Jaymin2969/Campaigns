import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Provider } from 'react-redux';
import CampaignForm from './Components/Campaign/CampaignForm';
import CampaignList from './Components/Campaign/CampaignList';
import { store } from './redux/store';
import Dashborad from './Pages/Dashboard/Dashboard';

function App() {

  return (
    <Provider store={store}>
    <div className="App">
<Dashborad/>
    </div>
  </Provider>
  );
}

export default App;
