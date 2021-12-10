import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";
import { connect } from "react-redux";
import { deleteExperience } from "../../actions/profile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const Experience = ({ deleteExperience,experience }) => {
  const expericences = experience.map((exp) => (
    <tr key={exp._id}>
      <td>{exp.company}</td>
      <td className="hide-sm">{exp.title}</td>
      <td>
        <Moment format="YYYY/MM/DD">{exp.form}</Moment> -{" "}
        {exp.to === null ? (
          "Now"
        ) : (
          <Moment format="YYYY/MM/DD">{exp.to}</Moment>
        )}{" "}
      </td>
      <td>
        <button onClick={()=>deleteExperience(exp._id)} className="btn btn-danger"><FontAwesomeIcon icon={faTrash} /></button>
      </td>
    </tr>
  ));
  return (
    <Fragment>
      <h2 className="my-2">Experience Cridentials</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Company</th>
            <th className="hide-sm">Title</th>
            <th className="hide-sm">Years</th>
            <th />
          </tr>
        </thead>
        <tbody>{expericences}</tbody>
      </table>
    </Fragment>
  );
};

Experience.propTypes = {
  expericence: PropTypes.array.isRequired,
  deleteExperience:PropTypes.func.isRequired,
};

export default connect(null,{deleteExperience})(Experience);
