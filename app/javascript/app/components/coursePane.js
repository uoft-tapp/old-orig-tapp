import React from 'react'
import {} from 'react-bootstrap'
import { TableMenu } from './tableMenu.js'
import { ApplicantTable } from './applicantTable.js'

class CoursePane extends React.Component {
    render() {
	return (
		<div style={{float: "left", paddingLeft: "1vw"}} >
		<ApplicantTable {...this.props.abc} assigned={this.props.assigned}/>
		<TableMenu {...this.props.abc.course1}/>
		<ApplicantTable {...this.props.abc} assigned={this.props.unassigned}/>
		</div>
	);
    }
}

export { CoursePane };
