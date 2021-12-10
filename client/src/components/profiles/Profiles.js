
import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layout/spinner";
import {getProfiles} from "../../actions/profile";
import { faConnectdevelop } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ProfileItems from "./ProfilesItems";

const Profiles = ({ getProfiles, profile: { profiles, loading } }) => {
  useEffect(() => {
    getProfiles();
  }, [getProfiles]);

  return <Fragment> 
     
      { loading ? <Spinner /> : <Fragment>
            <h1 className="large text-primary">Developers</h1>
            <p className="lead"> 
                <FontAwesomeIcon icon={faConnectdevelop} /> {'  '}
                Browse And Connect With Devs
            </p>
            <div className="profiles">
          {profiles.length>0 ? (
            profiles.map(profile=>(
              <ProfileItems key={profile._id} profile={profile} />
            ))
          ) : <h4> 'No profiles found' </h4>}
            </div>
            
          </Fragment> }
  </Fragment>;
};

Profiles.propTypes = {
  profile: PropTypes.object.isRequired,
  getProfiles: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default connect(mapStateToProps, { getProfiles })(Profiles);
