import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import App from './App';
import Register from './components/Register/Register';
import Home from './components/Home/Home';
import FileExplorer from './components/FileExplorer/FileExplorer';
import About from './components/About/About';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <Router>
        <Switch>
          <Route exact path='/' component={App} />
          <Route path='/register' component={Register} />
          <Route path='/home' component={Home} />
          <Route path='/fileexplorer' component={FileExplorer} />
          <Route path='/about' component={About} />
          {/*<Route component={NotFound} />*/}
        </Switch>
    </Router>,
    document.getElementById('root')
  );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
