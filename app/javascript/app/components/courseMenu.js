import React from 'react'
import {ListGroup, ListGroupItem} from 'react-bootstrap'

class CourseMenu extends React.Component {
    render() {
	const courses = this.props.courses.slice();
	courses.sort((a, b) => a.code > b.code);

	const list = courses.map(
	    (course) => {
		return this.props.selected.includes(course.code) ?
		    (<ListGroupItem className="course-menu-item" key={course.code}
		     onClick={() => this.props.handleClick(course.code)} active>
		     <span style={{float: 'left'}}>{course.code}</span>
		     <span style={{float: 'right'}}>{course.assigned} /{course.expected}</span>
		     </ListGroupItem>)
		: (<ListGroupItem className="course-menu-item" key={course.code}
		   onClick={() => this.props.handleClick(course.code)}>
		   <span style={{float: 'left'}}>{course.code}</span>
		   <span style={{float: 'right'}}>{course.assigned} /{course.expected}</span>
		   </ListGroupItem>);
	    });
	
	return <ListGroup style={{float: "left"}}>{list}</ListGroup>;
    }
}

export { CourseMenu };
