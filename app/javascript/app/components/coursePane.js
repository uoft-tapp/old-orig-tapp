import React from 'react'
import { Panel } from 'react-bootstrap'
import { ABCTableMenu } from './abcTableMenu.js'
import { ABCApplicantTable } from './abcApplicantTable.js'

class CoursePane extends React.Component {
    constructor(props) {
	super(props);
	
	this.tableHeaders = ['','Last Name', 'First Name', 'Dept.', 'Prog.', 'Year', 'Pref.', 'Other'];
	// fields from applicant list corresponding to headers above (ordered)
	// note that not all headers map directly to applicant list fields
	this.tableFields = ['lastName', 'firstName', 'dept', 'program', 'year'];
    }
    
    render() {
	let course = this.props.func.getCourseById(this.props.course);
	if (!course)
	    return null;
	
	return (
		<Panel style={{height: '100%', maxHeight: '88vh', overflow: 'auto'}}
	    header={<span>{course.code}&emsp;{course.assignmentCount} /{course.estimatedPositions}
		    <i className="fa fa-close" style={{float: 'right'}} onClick={() => {
			this.props.func.toggleSelectedCourse(this.props.course);
			this.props.func.toggleCoursePanel(this.props.course);
		    }}></i>
		    </span>}>
		<ABCApplicantTable tableHeaders={this.tableHeaders} tableFields={this.tableFields} assigned={true}
	    {...this.props}/>
		
		<ABCTableMenu sortFields={this.tableHeaders}
	    {...this.props.func.getCoursePanelFields(this.props.course)} {...this.props}/>
		
		<ABCApplicantTable tableHeaders={this.tableHeaders} tableFields={this.tableFields} assigned={false}
	    {...this.props}/>
		</Panel>
	);
    }
}

export { CoursePane };
