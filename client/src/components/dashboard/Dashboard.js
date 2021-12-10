import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCurrentProfile } from "../../actions/profile";
import Spinner from "../layout/spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faUserMinus } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { DashboardActions } from "./DashboardActions";
import Experience from "./Experience";
import Education from "./Education";
import { deleteAccount } from "../../actions/profile";

const Dashboard = ({
  getCurrentProfile,
  deleteAccount,
  auth: { user },
  profile: { profile, loading },
}) => {
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);
  return loading && profile === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className="large text-primary">Dashboard</h1>
      <p className="lead">
        {" "}
        <FontAwesomeIcon icon={faUser} /> Welcome {user && user.name}
      </p>
      {profile !== null ? (
        <Fragment>
          <DashboardActions />
          {profile.experience.length>0 ? <Experience experience={profile.experience} /> : <div><h2 className="text-primary my-2">No experience Added</h2> <h4 className="text-color-black">Go add some</h4></div> }
          {profile.education.length>0 ?  <Education education={profile.education} />: <div><h2 className="text-primary my-2">No education info Added</h2> <h4 className="text-color-black">Go add some</h4></div> }
          
         
          <div className="my-2">
          <button className="btn btn-danger" onClick={()=>deleteAccount()}>  <FontAwesomeIcon icon={faUserMinus} /> {' '}Delete my account </button>

          </div>
        </Fragment>
      ) : (
        <Fragment>
          <p>You didn't set a profile yet , Go ahead create you profile !</p>
          <Link to="create-profile" className="btn btn-primary my-1">
            Create profile !
          </Link>
        </Fragment>
      )}
    </Fragment>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  deleteAccount:PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, { getCurrentProfile , deleteAccount})(Dashboard);
