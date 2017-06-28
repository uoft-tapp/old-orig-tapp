import React from 'react'
import { ListGroup, ListGroupItem, Panel } from 'react-bootstrap'

class CourseMenu extends React.Component {
    constructor(props) {
	super(props);
	
	// sort the courses in order of course code
	this.courses = null;
	if (props.courses.list) {
	    this.courses = Object.entries(props.courses.list);
	    this.courses.sort(([A, valA], [B, valB]) => valA.code < valB.code ? -1 : 1);
	}
    }
    
    componentWillUpdate() {
	// sort the courses in order of course code, if they were not already sorted in the constructor
	if (!this.courses && this.props.courses.list) {
	    this.courses = Object.entries(this.props.courses.list);
	    this.courses.sort(([A, valA], [B, valB]) => valA.code < valB.code ? -1 : 1);
	}
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
	
	return (
		<Panel header='Courses' style={{height: '100%', overflow: 'auto'}}>
		<ListGroup fill>{list}</ListGroup>
		</Panel>
	);
    }
}

export { CourseMenu };
