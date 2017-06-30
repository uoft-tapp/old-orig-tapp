import React from 'react'
import { Panel } from 'react-bootstrap'
import { ABCTableMenu } from './abcTableMenu.js'
import { ABCApplicantTable } from './abcApplicantTable.js'

class CoursePane extends React.Component {
    constructor(props) {
	super(props);

	// table/menu configuration
	this.fields = [
	    {
		header: '',
		data: p => (
			<input type='checkbox' defaultChecked={p.assigned} onClick={() => props.func.addAssignment(
			    p.applicantId, p.course, props.func.getCourseById(p.course).positionHours)}/>
		),
	    },
	    {
		header: 'Last Name',
		data: p => p.applicant.lastName,
	    },
	    {
		header: 'First Name',
		data: p => p.applicant.firstName,
	    },
	    {
		header: 'Dept.',
		data: p => p.applicant.dept,
	    },
	    {
		header: 'Prog.',
		data: p => p.applicant.program,
	    },
	    {
		header: 'Year',
		data: p => p.applicant.year,
	    },
	    {
		header: 'Pref.',
		data: p => (props.func.getApplicationPreference(p.applicantId, p.course) ?
			    <i className='fa fa-check'/> : ''
			   ),
	    },
	    {
		header: 'Other',
		data: p => (
		    props.func.getAssignmentsByApplicant(p.applicantId).map(
			ass => (ass.positionId == p.course) ? '' : props.func.getCourseCodeById(ass.positionId)
		    ).join(' ')
		),
	    }
	];
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
		<ABCApplicantTable config={this.fields} assigned={true} {...this.props}/>
		
	    	<ABCTableMenu config={this.fields}
	    {...this.props.func.getCoursePanelFieldsByCourse(this.props.course)} {...this.props}/>	
		
		<ABCApplicantTable config={this.fields} assigned={false} {...this.props}/>
		</Panel>
	);
    }
}

export { CoursePane };
