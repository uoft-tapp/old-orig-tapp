import React from 'react'
import { TableMenu } from './tableMenu.js'
import { ABCApplicantTable } from './abcApplicantTable.js'

class CoursePane extends React.Component {
    constructor(props) {
	super(props);
	this.tableHeaders = ['', 'Last Name', 'First Name', 'Dept.', 'Prog.', 'Year', 'Pref.', 'Other'];
	// fields from applicant list corresponding to headers above (ordered)
	this.tableFields = ['assigned', 'last_name', 'first_name', 'dept', 'program_id', 'yip', 'utorid', 'phone'];
    }
    
    render() {
	if (!this.props.applicants.fetched)
	    return null;
	
	return (
		<div>
		<ABCApplicantTable tableHeaders={this.tableHeaders} tableFields={this.tableFields}
	    applicants={this.props.applicants.assigned} assigned={true}/>
		
		<ABCApplicantTable tableHeaders={this.tableHeaders} tableFields={this.tableFields}
	    applicants={this.props.applicants.unassigned} assigned={false}/>
		</div>
	);
    }
}

export { CoursePane };
