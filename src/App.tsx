import React from 'react';
import './App.css';
import {Provider} from 'react-redux';
import {store} from './redux/store';
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
