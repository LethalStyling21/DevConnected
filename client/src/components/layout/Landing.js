import React from 'react';
import { Link,Redirect } from 'react-router-dom';
import {connect } from 'react-redux';
import PropTypes  from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';

export const landing = ({isAuthenticated}) => {
  if (isAuthenticated){
   return <Redirect to ="/dashboard"/>
  }
    return (
        <section className="landing">
      <div className="dark-overlay">
        <div className="landing-inner">
          <h1 className="x-large">
          <FontAwesomeIcon icon={faCoffee}/>{' '}
            DevConnected
          </h1>
          <p className="lead">
          Create your profile , connect , share posts , and get help with DevConnected
          </p>
          <div className="buttons">
            <Link to="/register" className="btn btn-primary">Sign Up</Link>
            <Link to="/login" clLinkssName="btn btn-light">Login</Link>
          </div>
        </div>
      </div>
    </section>
    )
}
landing.propTypes={
  isAuthenticated:PropTypes.bool
}
const mapStateToProps = state =>({
  isAuthenticated:state.auth.isAuthenticated
})
export default connect(mapStateToProps)(landing) ;
