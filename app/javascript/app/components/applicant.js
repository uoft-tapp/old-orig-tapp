import React from 'react'

const Applicant = props => {
	return <div className="container-fluid" style={{paddingTop: "70px"}}><h1>Applicant {props.match.params.id}!</h1></div>
};

export { Applicant };