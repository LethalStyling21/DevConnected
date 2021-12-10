import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const ProfilesItems = ({profile: {
    user:{_id , name , avatar},
    status,
    company,
    location,
    skills
}}) => {
    return (
        <div className="profile bg-light">
          <img src={avatar} alt="" className="round-img"/>  
          <div>
           <h2>{name}</h2>
        <p>{status} {company && <span> at {company}</span>}</p>
        <p className="my-1"> {location && <span>{location}</span>} </p>
        <Link to={`/profile/${_id}`} className="btn btn-primary">
            view profile
        </Link>
        </div>
        <ul>
            {skills.slice(0,5).map((skill , index)=>(
                <li key={index} className="text-primary"> <FontAwesomeIcon icon={faCheck}/> {skill}</li>
            ))}
        </ul>
      </div>
    )
}

ProfilesItems.propTypes = {
    profile:PropTypes.object.isRequired,
}

export default ProfilesItems
