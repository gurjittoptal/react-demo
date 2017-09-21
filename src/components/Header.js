import React from 'react';
import { Link } from 'react-router';
import './header.css'

const LoggedOutView = props => {
  if (!props.currentUser) {
    return (
        <div className="container">
          <div className="row">
            <div className="top-menu">
                <Link to="/" className="nav-link">
                  Home
                </Link>
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <Link to="/register" className="nav-link">
                  Register
                </Link>
            </div>
            
          </div>
        </div>
    );
  }
  return null;
};

const LoggedInView = props => {
  if (props.currentUser) {
    return (
      <div className="container">
          <div className="row">
            <div className="top-menu">
                <Link to="/" className="nav-link">
                  Repairs
                </Link>
                <Link to="/" className="nav-link">
                  Users
                </Link>
                <Link to="settings" className="nav-link">
                  &nbsp;<i className="fa fa-cog" aria-hidden="true"></i>&nbsp;
                </Link>
            </div>
            
          </div>
        </div>
    );
  }

  return null;
};

class Header extends React.Component {
  render() {
    return (
        <div className="container">

          <div className="brand-name row">
            <Link to="/" className="twelve columns ">
              <i className="fa fa-car" aria-hidden="true"></i> {this.props.appName}
            </Link>
          </div>

          <LoggedOutView currentUser={this.props.currentUser} />

          <LoggedInView currentUser={this.props.currentUser} />
        </div>
    );
  }
}

export default Header;
