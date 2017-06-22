import React from 'react'
import {ListGroup, ListGroupItem} from 'react-bootstrap'

class CourseMenu extends React.Component {
    render() {
	const courses = this.props.courses.slice();
	courses.sort((a, b) => a.code > b.code);

	const list = courses.map(
	    (course) => {
		return (<ListGroupItem className="course-menu-item" key={course.code}
			onClick={() => {
			    this.props.toggleSelected(course.code);
			    this.props.toggleCoursePanel(course.code);
			}}
			active={this.props.isSelected(course.code)}>
			<span style={{float: 'left'}}>{course.code}</span>
			<span style={{float: 'right'}}>{course.assigned} /{course.expected}</span>
			</ListGroupItem>);
	    });
	
	return <ListGroup style={{float: "left"}}>{list}</ListGroup>;
    }
}

export { CourseMenu };
