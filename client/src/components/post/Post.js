import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layout/spinner";
import { addComment, getPost } from "../../actions/post";
import PostItem from "../posts/PostItem";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward } from "@fortawesome/free-solid-svg-icons";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

const Post = ({ getPost, post: { post, loading }, match }) => {
  useEffect(() => {
    getPost(match.params.id);
  }, [getPost]);
return loading ||post === null ? <Spinner /> : <Fragment>
    <Link to='/posts' className='btn'> <FontAwesomeIcon icon={faBackward}/></Link>
    <PostItem post={post} showActions={false} />
    <CommentForm postId={post._id} />
    <div className="comments">
    {post.comments.map(comment=> (
        <CommentItem key={comment._id} comment={comment} postId={post._id} />
    ))}

    </div>
</Fragment>
};

Post.propTypes = {
  getPost: PropTypes.func.isRequired,
  post: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  post: state.post,
});
export default connect(mapStateToProps, { getPost })(Post);
