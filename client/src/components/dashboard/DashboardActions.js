import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { faBlackTie } from "@fortawesome/free-brands-svg-icons";


export const DashboardActions = () => {
  return (
    <div class="dash-buttons">
      <Link to="/edit-profile" class="btn btn-light">
      {" "}
        <FontAwesomeIcon icon={faUserCircle} />
        <i className="text-secondary"></i> Edit Profile
      </Link>
      <Link to="/add-experience" className="btn btn-light">
      {" "}
        <FontAwesomeIcon icon={faBlackTie} />
        <i className="text-secondary"></i> Add Experience
        
      </Link>
      <Link to="/add-education" className="btn btn-light">
      {" "}
        <FontAwesomeIcon icon={faGraduationCap} />
        <i className="text-secondary"></i> Add Education
      </Link>
    </div>
  );
};
export default DashboardActions;
