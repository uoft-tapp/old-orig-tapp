import React from 'react'

class Applicant extends React.Component {
    selectThisTab() {
	this.props.nav.selectTab(this.props.nav.applicant.key);
    }
    
    componentDidMount() {
	this.selectThisTab();
    }

    componentDidUpdate() {	
	this.selectThisTab();
    }

    render() {
	return <div className="container-fluid" style={{paddingTop: "70px"}}><h1>Applicant {props.match.params.id}!</h1></div>
    }
}

export { Applicant };
