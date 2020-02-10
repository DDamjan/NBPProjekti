import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import App from './App';
import store from './store/store';

class Root extends Component {
    render() {
      return (
          <Provider store={store}>
            <App />
          </Provider>
      )
    }
  }

ReactDOM.render(<Root />, document.getElementById('root'));
