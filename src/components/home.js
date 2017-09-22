import { Link } from 'react-router';
import ListErrors from './ListErrors';
import React from 'react';
import agent from '../agent';
import './home.css'

import { connect } from 'react-redux';
import {
  HOME_PAGE_UNLOADED
} from '../actionTypes';


const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
  onUnload: () =>
    dispatch({ type: HOME_PAGE_UNLOADED })
});

class Home extends React.Component {
  constructor() {
    super();    
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    return (
      <div className="container">

        <div className="row">
          <div className="twelve columns anonymous-message">
                Welcome to the React Sample Auto Shop Single Page Application.
                <br/><br/>
                The application is React-based and allows users to create accounts and login in. Access is role based and repairs can be created/managed.  
          </div>   
        </div>

      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
