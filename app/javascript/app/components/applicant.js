import React from 'react'

class Applicant extends React.Component {
    selectThisTab() {
	this.props.nav.selectTab(this.props.navKey, this.props.match.params.id);
    }
    
    componentDidMount() {
	this.selectThisTab();
    }

    componentDidUpdate() {	
	this.selectThisTab();
    }

    render() {
	return <div className="container-fluid" style={{paddingTop: "70px"}}><h1>Applicant {this.props.match.params.id}!</h1></div>
    }
}

export { Applicant };
