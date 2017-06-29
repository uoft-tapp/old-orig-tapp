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
	    this.courses = Object.entries(this.courses);
	    this.courses.sort(([A, valA], [B, valB]) => valA.code < valB.code ? -1 : 1);
	}
    }
    
    componentWillUpdate() {
	this.sortCourses();
    }
    
    render() {
	if (!this.courses)
	    return null;
	
	let itemStyle = {height: '2em', padding: '3px'};
	
	const list = this.courses.map(
	    ([key, val]) => {
		return (<ListGroupItem className='course-menu-item' key={'course-' + key} style={itemStyle}
			onClick={() => {
			    this.props.func.toggleSelectedCourse(key);
			    this.props.func.toggleCoursePanel(key);
			}}
			active={this.props.func.isCourseSelected(key)}>
			<span style={{float: 'left'}}>{val.code}</span>
			<span style={{float: 'right'}}>{val.assignmentCount} /{val.estimatedPositions}</span>
			</ListGroupItem>);
	    });
	console.log('rerendering menu with',this.courses);	
	return (
		<Panel header='Courses' style={{height: '100%', overflow: 'auto'}}>
		<ListGroup fill>{list}</ListGroup>
		</Panel>
	);
    }
}

export { CourseMenu };
