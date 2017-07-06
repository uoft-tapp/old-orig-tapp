import React from 'react'
import { ListGroup, ListGroupItem, Panel } from 'react-bootstrap'

class CourseMenu extends React.Component {
    constructor(props) {
	super(props);
	
	this.sortCourses();
    }

    // acquire and sort courses in order of course code
    sortCourses() {
	if ((this.courses = this.props.func.getCoursesList())) {
	    this.courses = this.props.func.idEntries(this.courses);
	    this.courses.sort(([A, valA], [B, valB]) => valA.code < valB.code ? -1 : 1);
	}
    }
    
    componentWillUpdate() {
	this.sortCourses();
    }
    
    render() {
	if (!this.courses) {
	    return null;
	}
	
	const list = this.courses.map(
	    ([key, val]) => {
		return (<ListGroupItem key={'course-' + key}
			onClick={() => {
			    this.props.func.toggleSelectedCourse(key);
			    this.props.func.toggleCoursePanel(key);
			}}
			active={this.props.func.isCourseSelected(key)}>
			<span style={{float: 'left'}}>{val.code}</span>
			<span style={{float: 'right'}}>{val.assignmentCount} /{val.estimatedPositions}</span>
			</ListGroupItem>);
	    });

	return (
		<Panel header='Courses' className='course-list-panel'>
		<ListGroup className='course-list-group' fill>{list}</ListGroup>
		</Panel>
	);
    }
}

export { CourseMenu };
