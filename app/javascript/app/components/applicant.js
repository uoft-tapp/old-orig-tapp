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
      console.log("hello")
  	  return (<AssignmentForm {...this.props}/>);
    }
}

export { Applicant };
