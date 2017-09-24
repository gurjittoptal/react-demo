import React from 'react';
import { connect } from 'react-redux';
import agent from '../../agent';
import { 
  ADD_COMMENT,
  ADD_COMMENT_COMPONENT_UNLOADED
 } from '../../actionTypes';

const mapDispatchToProps = dispatch => ({
  onSubmit: (payload) =>
    dispatch({ type: ADD_COMMENT, payload })
});


const CommentView = props => {
  return (
    <div className="left-align">
      <br/>
      <div className="text-medium">{props.comment.comment}</div>
      <div className="text-small"><strong>{props.comment.user}</strong> - {props.comment.ts}</div>
    </div>
      );
};

const CommentList = props => {
  if (!props.comments) {
    return (
      <div>Loading...</div>
    );
  }
  return (
    <div>
          {
            props.comments.map(comment => {
              return (
                <CommentView comment={comment} key={comment.uid} />
              );
            })
          }
    </div>
  );
};

class Comments extends React.Component {
  constructor() {
    super();
    this.state = {
      comment: ''
    };

    this.setComment = ev => {
      this.setState({ comment: ev.target.value });
    };

    this.createComment = ev => {
      ev.preventDefault();
      const payload = agent.Comments.create(
        { text: this.state.comment,
          repairid: this.props.repair.uid
        });  

      this.setState({ comment: '' });
      this.props.onSubmit(payload);
    };
  }


  render() {
    console.log(this.props)
    return (
        <div>
          <div className="row">
            <br/>
            <div className="twelve columns left-align comment-heading">
              <div className="text-small bold">COMMENTS</div>      
            </div>
          </div>
          <div className="row">
              <br/>
              <div className="twelve columns left-align">
                <form onSubmit={this.createComment}>
                  <textarea className="comment-desc text-medium"
                    placeholder="Enter Comment Details..."
                    value={this.state.comment}
                    onChange={this.setComment}
                    rows="5">
                  </textarea>

                  <button
                      className="button-primary text-medium"
                      type="submit"
                      disabled={this.props.inProgress}>
                      Add Comment
                  </button>
                  <br/>
                  <span className="error-message">{this.props.commenterror}</span>
                </form>
              </div>
          </div>
          <div className="row">
              <CommentList comments={this.props.repair.comments} />
          </div>
        </div>
    );
  }
}

export default connect(() => ({}), mapDispatchToProps)(Comments);
