import { Link } from 'react-router';
import ListErrors from './../ListErrors';
import React from 'react';
import agent from '../../agent';
import { connect } from 'react-redux';



const mapStateToProps = state => ({ ...state.user });

const mapDispatchToProps = dispatch => ({
  
});

const RepairDetails = props => {
  
  if (props.isdeleted) {
    return (
      <div>User does not exist!</div>
    );
  }

  if (!props.user) {
    return (
      <div>Loading...</div>
    );
  }

  return (
    <div>
       <h4>{props.user.email}</h4>
       <div>
          Role - <strong>{props.user.role}</strong>
       </div>

       <DeleteUserButton user={props.user} />
    </div>
  );
};


class Repair extends React.Component {
  constructor() {
    super();    
  }

  componentWillMount() {
    //this.props.onLoad(Promise.all([agent.Users.get(this.props.params.id)]));
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="two columns">
            &nbsp;
          </div>
          <div className="eight columns anonymous-message">
                REAPIR PAGE IS HERE
          </div>   
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Repair);
