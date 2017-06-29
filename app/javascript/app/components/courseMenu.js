import React from 'react'
import { ListGroup, ListGroupItem, Panel } from 'react-bootstrap'

class CourseMenu extends React.Component {
    render() {
	let itemStyle = {height: '2em', padding: '3px'};
	
	const list = this.props.courses.map(
	    (course) => {
		return (<ListGroupItem className="course-menu-item" key={course.code} style={itemStyle}
			onClick={() => {
			    this.props.toggleSelected(course.code);
			    this.props.toggleCoursePanel(course.code);
			}}
			active={this.props.isSelected(course.code)}>
			<span style={{float: 'left'}}>{course.code}</span>
			<span style={{float: 'right'}}>{course.assigned} /{course.expected}</span>
			</ListGroupItem>);
	    });
	
	return (
		<Panel header="Courses" style={{height: '100%', overflow: 'auto'}}>
		<ListGroup fill>{list}</ListGroup>
		</Panel>
	);
    }
}

export { CourseMenu };
