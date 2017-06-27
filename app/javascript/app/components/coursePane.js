import React from 'react'
import { Panel } from 'react-bootstrap'
import { ABCTableMenu } from './abcTableMenu.js'
import { ABCApplicantTable } from './abcApplicantTable.js'

class CoursePane extends React.Component {
    constructor(props) {
	super(props);
	this.tableHeaders = ['', 'Last Name', 'First Name', 'Dept.', 'Prog.', 'Year', 'Pref.', 'Other'];
	// fields from applicant list corresponding to headers above (ordered)
	this.tableFields = ['assigned', 'last_name', 'first_name', 'phone', 'phone', 'phone', 'phone', 'phone'];
    }
    
    render() {
	if (!this.props.applicants.fetched)
	    return null;

	return (
		<Panel style={{height: '100%', maxHeight: '88vh', overflow: 'auto'}}
	    header={<span>{this.props.course}
		    <i className="fa fa-close" style={{float: 'right'}} onClick={() => {
			this.props.courseMenu.toggleSelected(this.props.course);
			this.props.abcView.toggleCoursePanel(this.props.course);
		    }}></i>
		    </span>}>
		<ABCApplicantTable tableHeaders={this.tableHeaders} tableFields={this.tableFields}
	    applicants={[]} assigned={true}/>
		
		<ABCTableMenu sortFields={this.tableHeaders} filter={this.props.abcView.filter}
	    sort={(field) => { this.props.abcView.sort(this.props.course, field); }}
	    {...this.props.abcView.panelFields[this.props.course]}/>
		
		<ABCApplicantTable tableHeaders={this.tableHeaders} tableFields={this.tableFields}
	    applicants={this.props.applicants.list} assigned={false}/>
		</Panel>
	);
    }
}

export { CoursePane };
