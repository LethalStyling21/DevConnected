import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getGithubRepos } from "../../actions/profile";
import Spinner from "../layout/spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXbox } from "@fortawesome/free-brands-svg-icons";

const ProfileGithub = ({ username, getGithubRepos, repos }) => {
  useEffect(() => {
    getGithubRepos(username);
  }, [getGithubRepos]);
  return (
    <div className="profile-github">
      <h2 className="text-primary my-1">Github reposotory</h2>
      {repos === null ? (
        <Spinner />
      ) : (
        repos.map(repos => (
          <div key={repos._id} className="repo bg-white p-1 my-1">
            <div>
              <h4>
                <a
                  href={repos.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {repos.name}
                </a>
              </h4>
              <p>{repos.description}</p>
            </div>
            <div>
                <ul>
                    <li className="badge badge-primary"> Stars : {repos.stargazers_count} </li>
                    <li className="badge badge-light"> Watchers : {repos.watchers_count} </li>
                    <li className="badge badge-dark"> Forks : {repos.forks_count} </li>
                </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

ProfileGithub.propTypes = {
  getGithubRepos: PropTypes.func.isRequired,
  repos: PropTypes.array.isRequired,
  username: PropTypes.string.isRequired,
};
const mapStateToProps = (state) => ({
  repos: state.profile.repos,
});

export default connect(mapStateToProps, { getGithubRepos })(ProfileGithub);
/*   {repos === null ? (
        <Spinner />
      ) : (
        repos.map(repos => (
          <div key={repos._id} className="repo bg-hite p-1 my-1">
            <div>
              <h4>
                <a
                  href={repos.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {repos.name}
                </a>
              </h4>
            </div>
          </div>
        ))
      )} */