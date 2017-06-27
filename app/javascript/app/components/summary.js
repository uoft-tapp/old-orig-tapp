import React from 'react'

class Summary extends React.Component {
    render() {
	return <div className="container-fluid" style={{paddingTop: "70px"}}><h1>Summary!</h1></div>;
    }

    selectThisTab() {
	this.props.nav.selectTab(this.props.navKey);
    }
    
    componentDidMount() {
	this.selectThisTab();
    }

    componentDidUpdate() {	
	this.selectThisTab();
    }
}

export { Summary };
