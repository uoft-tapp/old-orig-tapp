import React from 'react'
import ReactDOM from 'react-dom'

class Courses extends React.Component {
    render() {
	return <div className="container-fluid" style={{paddingTop: "70px"}}><h1>Courses!</h1></div>;
    }

    selectThisTab() {
	this.props.func.selectNavTab(this.props.navKey);
    }
    
    componentDidMount() {
	this.selectThisTab();
    }

    componentDidUpdate() {	
	this.selectThisTab();
    }
}

export { Courses };

