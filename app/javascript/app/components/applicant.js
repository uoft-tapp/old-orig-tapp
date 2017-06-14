import React from 'react'

const Applicant = ({match}) => {
	return <div className="container-fluid" style={{paddingTop: "70px"}}><h1>Applicant {match.params.id}!</h1></div>
};

export { Applicant };
