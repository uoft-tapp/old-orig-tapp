import React from 'react'
import { AssignmentForm } from './assignmentForm.js'

class Applicant extends React.Component {
    selectThisTab() {
	this.props.func.selectNavTab(this.props.navKey, this.props.match.params.id);
    }

    componentDidMount() {
	this.selectThisTab();
    }

    componentDidUpdate() {
	this.selectThisTab();
    }

    render() {
	return (<div className="container-fluid">
            <AssignmentForm {...this.props}/>
          </div>);
    }
}

export { Applicant };
